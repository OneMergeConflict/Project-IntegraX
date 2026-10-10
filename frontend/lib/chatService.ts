import { queryLegalKnowledge, ALL_LEGAL_ENTRIES } from "./legalKnowledgeBase";

export interface ChatServiceResponse {
  reply: string;
  source: "live_ai" | "local_knowledge_base" | "offline_engine";
  statuteReference?: string;
  categoryTag?: string;
  jargonExplanation?: { term: string; definition: string };
  disclaimer: string;
}

const SYSTEM_INSTRUCTION = `You are IntegraX Legal Intelligence Assistant, an elite legal technology AI specializing in Indian commercial law, the Constitution of India, and corporate contract analysis.
Constraints:
1. Answer in clear, plain language while maintaining strict legal accuracy.
2. If legal jargon is used (e.g. indemnity, condition precedent, non-compete, estoppel, liquidated damages), explicitly identify and define it in a separate 'jargon' block.
3. Reference relevant Indian statutes (e.g. Indian Contract Act 1872, Arbitration & Conciliation Act 1996, Specific Relief Act 1963, Companies Act 2013, IBC 2016, or Constitutional Articles) only when strictly relevant.
4. If asked about Constitutional Articles (e.g., Article 14, 15, 19, 21, 299, 300A), explain both their constitutional meaning and commercial/business implications.
5. Always maintain professional neutrality.`;

/**
 * Universal chat service that supports:
 * 1. Live Gemini / OpenAI API via Next.js backend API
 * 2. Client-provided API key from UI settings
 * 3. Graceful offline fallback with comprehensive Indian legal knowledge base
 */
export async function sendLegalQuery(
  message: string,
  contextFinding?: { title: string; clause?: string; quote?: string },
  customApiKey?: string
): Promise<ChatServiceResponse> {
  const DISCLAIMER = "IntegraX provides AI-generated insights for informational purposes. This does not replace advice from a qualified advocate.";

  // 1. Attempt Live AI via Next.js API route (/api/chat)
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        contextFinding,
        customApiKey: customApiKey || (typeof window !== "undefined" ? localStorage.getItem("integrax_api_key") : null),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          reply: data.reply,
          source: data.isLiveAi ? "live_ai" : "local_knowledge_base",
          statuteReference: data.statuteReference,
          categoryTag: data.categoryTag || (data.isLiveAi ? "Live LLM Engine" : "Verified Indian Legal Base"),
          jargonExplanation: data.jargonExplanation,
          disclaimer: DISCLAIMER,
        };
      }
    }
  } catch (err) {
    console.warn("API route unavailable or offline, switching to client knowledge base:", err);
  }

  // 2. Fallback to Local Indian Legal Knowledge Base Matcher
  const match = queryLegalKnowledge(message);
  if (match) {
    return {
      reply: `### ${match.title}\n\n**Statutory Summary:**\n${match.summary}\n\n**Legal Analysis & Framework:**\n${match.fullExplanation}\n\n**Commercial & Business Impact:**\n${match.commercialImpact}`,
      source: "local_knowledge_base",
      statuteReference: match.citationOrArticle,
      categoryTag: match.category,
      jargonExplanation: match.jargonTerm ? { term: match.jargonTerm, definition: match.jargonDefinition || "" } : undefined,
      disclaimer: DISCLAIMER,
    };
  }

  // 3. Smart offline semantic analysis for any other question
  const q = message.toLowerCase();
  let reply = "";
  let statute = "Indian Commercial Jurisprudence";
  let jargonTerm = "";
  let jargonDef = "";

  if (q.includes("constitution") || q.includes("article")) {
    reply = `Under the Constitution of India, economic and civic activities are governed under:\n• Part III (Fundamental Rights): Article 14 (Equality & Non-Arbitrariness in tenders), Article 19(1)(g) (Freedom of Trade & Business), and Article 21 (Personal Liberty & Privacy).\n• Part XII: Article 299 (Formalities for binding Government & PSU contracts) and Article 300A (Right to Property).\n• Part XIII: Articles 301–304 (Freedom of Inter-State Trade and Commerce across India).\n\nYou can query any specific Article (e.g. Article 14, 15, 16, 19, 21, 298, 299, 300A, 301) for detailed case ratios.`;
    statute = "The Constitution of India";
    jargonTerm = "Constitutional Safeguard";
    jargonDef = "Guarantees in the Constitution protecting citizens and businesses against arbitrary executive action.";
  } else if (q.includes("court") || q.includes("judiciary") || q.includes("appeal") || q.includes("jurisdiction")) {
    reply = `In Indian business litigation, dispute pathways generally proceed through:\n1. Commercial Courts established under the Commercial Courts Act, 2015 for fast-track resolution of commercial disputes above designated pecuniary values.\n2. Arbitral Tribunals constituted under the Arbitration and Conciliation Act, 1996 for contractual disputes with arbitration agreements.\n3. High Courts under Article 226 for writ petitions against arbitrary PSU/State tender actions.\n4. Special tribunals like NCLT/NCLAT under the Companies Act and Insolvency and Bankruptcy Code.`;
    statute = "Commercial Courts Act, 2015";
    jargonTerm = "Pecuniary Jurisdiction";
    jargonDef = "The financial threshold value that determines which court has the authority to hear a lawsuit.";
  } else {
    reply = `Regarding "${message}": Under Indian commercial law, contractual rights and duties are governed by the Indian Contract Act, 1872. All promises require mutual consideration (Section 25), lawful object (Section 23), and must not be in restraint of trade (Section 27) or legal proceedings (Section 28). If this inquiry relates to a specific agreement, verify whether there is an express dispute resolution clause and clear performance triggers.`;
    statute = "Indian Contract Act, 1872";
    jargonTerm = "Lawful Consideration";
    jargonDef = "The legal value or exchange given by each party to induce the other to enter into the contract.";
  }

  return {
    reply,
    source: "offline_engine",
    statuteReference: statute,
    categoryTag: "Offline Legal Engine",
    jargonExplanation: jargonTerm ? { term: jargonTerm, definition: jargonDef } : undefined,
    disclaimer: DISCLAIMER,
  };
}
