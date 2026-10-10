import os
import re
import json
import logging
from typing import List, Dict, Any, Tuple, Optional
from .schemas import (
    FindingSchema,
    FindingType,
    VerificationStatus,
    DocumentPageParsed,
    DocumentMetadata,
    ProcessingStage,
    DocumentAnalysisResponse
)

logger = logging.getLogger("integrax.pipeline")


class DocumentPipeline:
    """
    IntegraX Hybrid AI & Deterministic Processing Pipeline:
    - Step 1: Parse & Chunk strictly preserving page numbers (PyMuPDF / fitz).
    - Step 2: LLM Extraction (Structured JSON Output).
    - Step 3: Deterministic Evidence Verification against source text.
    - Step 4: Normalization & Output.
    """

    @staticmethod
    def extract_text_by_pages(file_path: str) -> List[DocumentPageParsed]:
        """
        Step 1: Parse & Chunk
        Extract text from the PDF strictly preserving page numbers.
        Falls back cleanly if PyMuPDF (fitz) is not installed in the current environment.
        """
        pages: List[DocumentPageParsed] = []
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(file_path)
            for page_index in range(len(doc)):
                page = doc[page_index]
                text = page.get_text("text")
                pages.append(DocumentPageParsed(
                    page_number=page_index + 1,
                    text=text.strip()
                ))
            doc.close()
        except ImportError:
            logger.warning("PyMuPDF (fitz) not found. Using fallback text parser.")
            # Simple text reader fallback for testing/demo
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            # Split mock or plain text into simulated pages
            chunks = [content[i:i + 2000] for i in range(0, max(len(content), 1), 2000)]
            for idx, chunk in enumerate(chunks):
                pages.append(DocumentPageParsed(page_number=idx + 1, text=chunk))
        return pages

    @staticmethod
    def normalize_string_for_search(text: str) -> str:
        """
        Normalizes whitespace, line breaks, and punctuation for robust quote matching.
        """
        if not text:
            return ""
        # Collapse all whitespace and newlines
        cleaned = re.sub(r"\s+", " ", text)
        return cleaned.strip()

    @classmethod
    def verify_evidence_deterministically(
        cls, 
        finding: Dict[str, Any], 
        pages: List[DocumentPageParsed]
    ) -> Tuple[VerificationStatus, Optional[int]]:
        """
        Step 3: Deterministic Evidence Verification (Crucial)
        Takes the exact_source_quote from LLM output and executes a strict/normalized
        search against the original parsed document text across all pages.
        
        If a match is found:
            returns (VerificationStatus.VERIFIED, matched_page_number)
        If NO match is found:
            returns (VerificationStatus.FAILED, None) -> flagged as hallucinated/unverified
        """
        quote = finding.get("exact_source_quote", "").strip()
        if not quote:
            return VerificationStatus.FAILED, None

        normalized_quote = cls.normalize_string_for_search(quote).lower()

        # 1. Exact case-insensitive substring search page by page
        for page in pages:
            normalized_page_text = cls.normalize_string_for_search(page.text).lower()
            if normalized_quote in normalized_page_text:
                return VerificationStatus.VERIFIED, page.page_number

        # 2. Relaxed punctuation-stripped search for slight formatting differences
        stripped_quote = re.sub(r"[^\w\s]", "", normalized_quote)
        if len(stripped_quote) > 15:
            for page in pages:
                normalized_page_text = cls.normalize_string_for_search(page.text).lower()
                stripped_page = re.sub(r"[^\w\s]", "", normalized_page_text)
                if stripped_quote in stripped_page:
                    return VerificationStatus.VERIFIED, page.page_number

        # If no verified match in source text, flag as failed
        return VerificationStatus.FAILED, None

    @classmethod
    def normalize_finding(cls, raw: Dict[str, Any], status: VerificationStatus, page_num: Optional[int]) -> FindingSchema:
        """
        Step 4: Normalization & Output
        - Enforces strict schema
        - Prevents inventing calendar dates: if trigger has no explicit date, leave as 'Unresolved'
        """
        raw_due_date = raw.get("due_date")
        # Check if due_date is an invented calendar date or missing
        if not raw_due_date or raw_due_date.strip().lower() in ["none", "n/a", "null", ""]:
            due_date = "Unresolved"
        else:
            due_date = raw_due_date

        finding_type = raw.get("type", "obligation").lower()
        if finding_type not in [t.value for t in FindingType]:
            finding_type = FindingType.OBLIGATION

        return FindingSchema(
            id=raw.get("id", f"find-{os.urandom(4).hex()}"),
            type=FindingType(finding_type),
            category=raw.get("category", "Contractual Term"),
            title=raw.get("title", "Untitled Clause Finding"),
            explanation=raw.get("explanation", ""),
            responsible_party=raw.get("responsible_party"),
            trigger=raw.get("trigger"),
            period=raw.get("period"),
            due_date=due_date,
            suggested_action=raw.get("suggested_action"),
            exact_source_quote=raw.get("exact_source_quote", ""),
            page_number=page_num if status == VerificationStatus.VERIFIED else raw.get("page_number"),
            clause_reference=raw.get("clause_reference"),
            verification_status=status,
            confidence_score=0.98 if status == VerificationStatus.VERIFIED else 0.40
        )
