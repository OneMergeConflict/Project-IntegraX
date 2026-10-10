from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class FindingType(str, Enum):
    RISK = "risk"
    DEADLINE = "deadline"
    OBLIGATION = "obligation"
    KEY_CLAUSE = "key_clause"


class VerificationStatus(str, Enum):
    VERIFIED = "verified"
    FAILED = "failed"
    UNVERIFIED = "unverified"


class ProcessingStage(str, Enum):
    READING_DOCUMENT = "Reading document"
    IDENTIFYING_CLAUSES = "Identifying clauses"
    EXTRACTING_OBLIGATIONS = "Extracting obligations"
    CHECKING_EVIDENCE = "Checking evidence"
    PREPARING_REPORT = "Preparing report"
    COMPLETED = "Completed"
    FAILED = "Failed"


class FindingSchema(BaseModel):
    id: str = Field(..., description="Unique ID for the finding")
    type: FindingType = Field(..., description="Finding type: risk, deadline, obligation, key_clause")
    category: str = Field(..., description="Category badge, e.g. Payment, Termination, Liability")
    title: str = Field(..., description="Concise finding headline")
    explanation: str = Field(..., description="Clear explanation in plain language")
    responsible_party: Optional[str] = Field(None, description="Responsible party, e.g. Vendor, Client, Both")
    trigger: Optional[str] = Field(None, description="Trigger event or condition")
    period: Optional[str] = Field(None, description="Time window or grace period")
    due_date: Optional[str] = Field("Unresolved", description="Explicit calendar date or 'Unresolved'")
    suggested_action: Optional[str] = Field(None, description="Recommended legal or business action")
    exact_source_quote: str = Field(..., description="Exact verbatim quote extracted from document")
    page_number: Optional[int] = Field(None, description="Exact verified page number from source")
    clause_reference: Optional[str] = Field(None, description="Clause or section identifier")
    verification_status: VerificationStatus = Field(
        VerificationStatus.UNVERIFIED, 
        description="Deterministic verification outcome: verified, failed, unverified"
    )
    confidence_score: Optional[float] = Field(0.95, description="Model or verification confidence")


class DocumentPageParsed(BaseModel):
    page_number: int
    text: str


class DocumentMetadata(BaseModel):
    id: str
    title: str
    filename: str
    file_size_bytes: int
    page_count: int
    status: ProcessingStage
    step_number: int
    created_at: str
    summary: Optional[str] = None
    risk_score: Optional[int] = None
    stats: Dict[str, int] = Field(default_factory=dict)


class DocumentAnalysisResponse(BaseModel):
    metadata: DocumentMetadata
    findings: List[FindingSchema]
    disclaimer: str = (
        "IntegraX provides AI-generated insights for informational purposes. "
        "This does not replace advice from a qualified advocate."
    )


class ChatRequest(BaseModel):
    document_id: str
    finding_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    reply: str
    jargon_definitions: Dict[str, str] = Field(default_factory=dict)
    disclaimer: str = (
        "IntegraX provides AI-generated insights for informational purposes. "
        "This does not replace advice from a qualified advocate."
    )
