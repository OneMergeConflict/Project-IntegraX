export type FindingType = 'risk' | 'deadline' | 'obligation' | 'key_clause';

export type VerificationStatus = 'verified' | 'failed' | 'unverified';

export type ProcessingState = 
  | 'reading_document' 
  | 'identifying_clauses' 
  | 'extracting_obligations' 
  | 'checking_evidence' 
  | 'preparing_report' 
  | 'completed';

export interface Finding {
  id: string;
  type: FindingType;
  category: string;
  title: string;
  explanation: string;
  responsible_party: string;
  trigger: string;
  period: string;
  due_date: string; // "Unresolved" if not an explicit calendar date
  suggested_action: string;
  exact_source_quote: string;
  page_number?: number;
  clause_reference?: string;
  verification_status: VerificationStatus;
  confidence_score: number;
}

export interface DocumentAnalysis {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  pageCount: number;
  uploadedAt: string;
  riskScore: number;
  summary: string;
  parties: {
    firstParty: string;
    secondParty: string;
    governingLaw: string;
  };
  stats: {
    totalFindings: number;
    risksCount: number;
    deadlinesCount: number;
    obligationsCount: number;
    keyClausesCount: number;
    verifiedPercentage: number;
  };
  findings: Finding[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  jargonExplanation?: { term: string; definition: string };
  referencedClause?: string;
}

export interface Advocate {
  id: string;
  name: string;
  barCouncilId: string;
  firm: string;
  specialization: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  contactEmail: string;
  phone: string;
  chamberAddress: string;
  consultationFee?: string;
  practiceCourts?: string[];
  isAvailable: boolean;
}

