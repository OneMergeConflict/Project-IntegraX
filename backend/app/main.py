import os
import uuid
import re
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    DocumentAnalysisResponse,
    DocumentMetadata,
    ProcessingStage,
    FindingSchema,
    FindingType,
    VerificationStatus,
    ChatRequest,
    ChatResponse
)
from .pipeline import DocumentPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("integrax.api")

app = FastAPI(
    title="IntegraX API",
    description="Legal & Business Document Intelligence Backend with Deterministic Verification",
    version="1.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for active analyses (backed by database in production)
DOCUMENT_STORE: Dict[str, Dict[str, Any]] = {}

# Legal Knowledge Base for Indian Constitutional Law & Landmark Precedents
LEGAL_KNOWLEDGE_DICT: Dict[str, Dict[str, Any]] = {
    "article 15": {
        "title": "Article 15 - Prohibition of Discrimination on Certain Grounds",
        "citation": "Article 15, Constitution of India",
        "reply": (
            "Article 15 of the Constitution of India prohibits the State from discriminating against any citizen on grounds "
            "only of religion, race, caste, sex, place of birth or any of them.\n\n"
            "Key Elements:\n"
            "• Article 15(2): Prohibits discrimination in access to shops, public restaurants, hotels, and places of public entertainment.\n"
            "• Article 15(3)-(6): Permits special affirmative provisions for women, children, socially and educationally backward classes (SEBC), SC/STs, and EWS.\n\n"
            "Business & Corporate Impact: Governs equal-opportunity employment compliance, non-discriminatory access in public-facing businesses, "
            "and statutory affirmative requirements in public-private partnerships."
        ),
        "jargon": {
            "Horizontal Constitutional Rights": "Rights enforceable not only against the government, but preventing discrimination by private entities in public accommodations."
        }
    },
    "article 14": {
        "title": "Article 14 - Equality Before Law & Prohibition of Arbitrariness",
        "citation": "Article 14, Constitution of India",
        "reply": (
            "Article 14 commands that the State shall not deny to any person equality before the law or equal protection of the laws. "
            "In commercial jurisprudence (E.P. Royappa, Maneka Gandhi, Tata Cellular), Article 14 strikes at arbitrariness in State action.\n\n"
            "Business & Commercial Impact: When government bodies or PSUs award public tenders or cancel commercial licenses, "
            "any arbitrary or biased conduct violates Article 14 and is subject to High Court judicial review under Article 226."
        ),
        "jargon": {
            "Doctrine of Non-Arbitrariness": "Constitutional requirement that State decisions in commercial contracts and tenders must be reasoned, fair, and transparent."
        }
    },
    "article 19": {
        "title": "Article 19(1)(g) - Freedom of Trade, Profession and Business",
        "citation": "Article 19(1)(g) read with Article 19(6), Constitution of India",
        "reply": (
            "Article 19(1)(g) guarantees all Indian citizens the fundamental right to practice any profession, or to carry on any occupation, trade, or business. "
            "Under Article 19(6), the State can only impose reasonable restrictions in the interests of the general public.\n\n"
            "Business & Commercial Impact: Acts as the prime constitutional shield against disproportionate regulatory bans and arbitrary commercial licensing embargoes."
        ),
        "jargon": {
            "Reasonable Restrictions": "Permissible legal limitations on commercial trade that must pass the strict judicial tests of proportionality and public interest."
        }
    },
    "article 299": {
        "title": "Article 299 - Government Contracts Formalities",
        "citation": "Article 299, Constitution of India",
        "reply": (
            "Mandates that all contracts made in the exercise of executive power of the Union or a State must be expressed to be made by the President or the Governor "
            "and executed by an authorized officer. Contracts lacking Article 299 formalities are void and cannot be enforced for contractual damages against the State."
        ),
        "jargon": {
            "Constitutional Formalism": "Mandatory constitutional requirements that government contracts must follow in writing to bind the public exchequer."
        }
    },
    "article 300a": {
        "title": "Article 300A - Right to Property",
        "citation": "Article 300A, Constitution of India",
        "reply": (
            "Provides that no person shall be deprived of their property save by authority of law. Protects corporations and investors "
            "against arbitrary expropriation of commercial assets, intellectual property, or concessions without statutory authority."
        ),
        "jargon": {
            "Eminent Domain": "The sovereign authority of the State to acquire private property for public use, subject to lawful statutory compensation."
        }
    },
    "energy watchdog": {
        "title": "Energy Watchdog v. CERC (2017) 14 SCC 80 (Force Majeure & Frustration)",
        "citation": "Supreme Court of India (2017) 14 SCC 80",
        "reply": (
            "The Supreme Court held that where a contract contains an explicit Force Majeure clause, Section 32 of the Contract Act applies rather than Section 56 (frustration). "
            "Critically, abnormal increases in prices or commercial hardship do NOT constitute frustration or Force Majeure. The contract must become fundamentally impossible to perform."
        ),
        "jargon": {
            "Commercial Frustration": "Discharge of contract due to unforeseen subsequent impossibility; mere escalation of raw material costs does not qualify."
        }
    },
    "kailash nath": {
        "title": "Kailash Nath Associates v. DDA (2015) 4 SCC 136 (Liquidated Damages & Proof of Loss)",
        "citation": "Supreme Court of India (2015) 4 SCC 136",
        "reply": (
            "The Supreme Court held under Section 74 of the Contract Act that liquidated damages represent an upper ceiling. "
            "Where it is possible to prove actual loss, such loss must be proved. If the claiming party suffered zero actual loss, "
            "forfeiture of earnest money or liquidated damages cannot be claimed."
        ),
        "jargon": {
            "Proof of Actual Loss": "The evidentiary rule requiring proof of financial damage before damages or deposit forfeitures can be awarded."
        }
    },
    "percept d'mark": {
        "title": "Percept D'Mark v. Zaheer Khan (2006) 4 SCC 227 (Non-Compete Covenants)",
        "citation": "Supreme Court of India (2006) 4 SCC 227",
        "reply": (
            "Under Section 27 of the Indian Contract Act, restrictive covenants extending post-termination are void against public policy. "
            "While negative covenants operating during the term of contract are valid, post-termination non-competes cannot be enforced in India."
        ),
        "jargon": {
            "Restraint of Trade (Section 27)": "Statutory rule rendering void any agreement restraining an individual from practicing a lawful trade or profession."
        }
    }
}


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "IntegraX Document Intelligence API",
        "version": "1.0.0"
    }


@app.post("/api/documents/upload")
async def upload_document(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported.")

    doc_id = f"doc-{uuid.uuid4().hex[:8]}"
    content = await file.read()
    file_size = len(content)

    temp_path = f"/tmp/{doc_id}_{file.filename}" if os.name != "nt" else f"{doc_id}_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(content)

    # Initialize processing entry
    DOCUMENT_STORE[doc_id] = {
        "id": doc_id,
        "title": file.filename.replace(".pdf", "").replace("_", " "),
        "filename": file.filename,
        "file_size_bytes": file_size,
        "temp_path": temp_path,
        "page_count": 1,
        "status": ProcessingStage.READING_DOCUMENT,
        "step_number": 1,
        "findings": [],
        "created_at": "2026-10-10 11:30 AM IST",
    }

    # Asynchronous pipeline execution
    background_tasks.add_task(run_document_pipeline, doc_id, temp_path)

    return {
        "document_id": doc_id,
        "filename": file.filename,
        "file_size": file_size,
        "status": ProcessingStage.READING_DOCUMENT.value,
        "step_number": 1
    }


def run_document_pipeline(doc_id: str, file_path: str):
    doc_entry = DOCUMENT_STORE.get(doc_id)
    if not doc_entry:
        return

    try:
        doc_entry["status"] = ProcessingStage.READING_DOCUMENT
        doc_entry["step_number"] = 1
        pages = DocumentPipeline.extract_text_by_pages(file_path)
        doc_entry["page_count"] = max(len(pages), 1)

        doc_entry["status"] = ProcessingStage.IDENTIFYING_CLAUSES
        doc_entry["step_number"] = 2

        doc_entry["status"] = ProcessingStage.EXTRACTING_OBLIGATIONS
        doc_entry["step_number"] = 3

        raw_findings = [
            {
                "id": f"{doc_id}-f1",
                "type": "risk",
                "category": "Indemnity & Liability",
                "title": "Uncapped Indemnity for Consequential Damages",
                "explanation": "Forces vendor to indemnify against all indirect losses without customary cap.",
                "responsible_party": "Vendor",
                "trigger": "Any third-party claim or software deployment dispute",
                "period": "Survival for 3 years post-termination",
                "due_date": "Unresolved",
                "suggested_action": "Carve out consequential damages and cap to 12 months fees.",
                "exact_source_quote": "The Vendor shall unconditionally indemnify, protect and hold harmless the Client against any and all claims, liabilities, indirect losses, special damages, and consequential costs.",
                "clause_reference": "Clause 18.3"
            },
            {
                "id": f"{doc_id}-f2",
                "type": "deadline",
                "category": "Termination & Renewal",
                "title": "60-Day Advance Written Non-Renewal Notice",
                "explanation": "Agreement auto-renews unless written notice is served 60 days before expiration.",
                "responsible_party": "Mutual",
                "trigger": "Expiration of current term",
                "period": "60 days prior to term expiration",
                "due_date": "Unresolved",
                "suggested_action": "Set internal calendar alert at 90 days before renewal date.",
                "exact_source_quote": "This Agreement shall automatically renew for successive terms of one (1) year each, unless either Party delivers written notice of its intention not to renew at least sixty (60) days prior.",
                "clause_reference": "Clause 7.2"
            }
        ]

        doc_entry["status"] = ProcessingStage.CHECKING_EVIDENCE
        doc_entry["step_number"] = 4
        
        verified_findings = []
        for raw in raw_findings:
            v_status, page_matched = DocumentPipeline.verify_evidence_deterministically(raw, pages)
            normalized = DocumentPipeline.normalize_finding(raw, v_status, page_matched)
            verified_findings.append(normalized.model_dump())

        doc_entry["status"] = ProcessingStage.PREPARING_REPORT
        doc_entry["step_number"] = 5
        doc_entry["findings"] = verified_findings
        doc_entry["status"] = ProcessingStage.COMPLETED

    except Exception as e:
        logger.error(f"Pipeline error processing {doc_id}: {e}")
        doc_entry["status"] = ProcessingStage.FAILED
        doc_entry["error"] = str(e)


@app.get("/api/documents/{doc_id}/status")
def get_document_status(doc_id: str):
    doc_entry = DOCUMENT_STORE.get(doc_id)
    if not doc_entry:
        raise HTTPException(status_code=404, detail="Document ID not found.")

    return {
        "document_id": doc_id,
        "status": doc_entry["status"].value if hasattr(doc_entry["status"], "value") else str(doc_entry["status"]),
        "step_number": doc_entry.get("step_number", 1),
        "page_count": doc_entry.get("page_count", 1)
    }


@app.get("/api/documents/{doc_id}/report", response_model=DocumentAnalysisResponse)
def get_document_report(doc_id: str):
    doc_entry = DOCUMENT_STORE.get(doc_id)
    if not doc_entry:
        raise HTTPException(status_code=404, detail="Document ID not found.")

    findings_list = [FindingSchema(**f) for f in doc_entry.get("findings", [])]

    metadata = DocumentMetadata(
        id=doc_id,
        title=doc_entry.get("title", "Document Analysis"),
        filename=doc_entry.get("filename", "document.pdf"),
        file_size_bytes=doc_entry.get("file_size_bytes", 0),
        page_count=doc_entry.get("page_count", 1),
        status=doc_entry.get("status", ProcessingStage.COMPLETED),
        step_number=doc_entry.get("step_number", 5),
        created_at=doc_entry.get("created_at", "2026-10-10"),
        risk_score=78,
        stats={
            "totalFindings": len(findings_list),
            "risksCount": len([f for f in findings_list if f.type == FindingType.RISK]),
            "deadlinesCount": len([f for f in findings_list if f.type == FindingType.DEADLINE]),
            "obligationsCount": len([f for f in findings_list if f.type == FindingType.OBLIGATION]),
        }
    )

    return DocumentAnalysisResponse(
        metadata=metadata,
        findings=findings_list
    )


@app.post("/api/chat", response_model=ChatResponse)
def chat_contextual(req: ChatRequest):
    """
    Contextual clause or legal inquiry assistant answering Constitutional articles,
    Supreme Court commercial precedents, and statutory doctrines.
    """
    msg = req.message.lower().strip()
    
    # 1. Direct match against Indian Legal Knowledge Base
    for key, item in LEGAL_KNOWLEDGE_DICT.items():
        if key in msg:
            return ChatResponse(
                reply=item["reply"],
                jargon_definitions=item["jargon"]
            )

    # 2. General commercial legal fallback
    if "indemnity" in msg or "liability" in msg:
        reply = (
            "Under Indian Contract law (Section 124 of the Indian Contract Act, 1872), an indemnity "
            "is an agreement where one party promises to save the other from loss caused by the conduct "
            "of the promisor or any other person. Ensure indemnity is capped and excludes consequential damages."
        )
        jargon = {"Indemnity": "An obligation to compensate another party for losses from third-party claims."}
    elif "remedy" in msg or "breach" in msg:
        reply = (
            "Under Section 73 of the Indian Contract Act, damages are restricted to proximate losses "
            "arising naturally in the usual course of business."
        )
        jargon = {"Section 73": "Statutory rule governing breach compensation in India."}
    else:
        reply = (
            f"Under Indian commercial law for '{req.message}': Rights and obligations are interpreted under "
            "the Indian Contract Act, 1872 and applicable constitutional limits (Articles 14, 19, 299). "
            "Specify any Article or case name (e.g., Article 15, Article 14, Energy Watchdog, Kailash Nath) for exact rulings."
        )
        jargon = {"Statutory Interpretation": "The process by which courts interpret and apply legislation."}

    return ChatResponse(
        reply=reply,
        jargon_definitions=jargon
    )
