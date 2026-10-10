import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiFindingOutput {
  id: string;
  type: "risk" | "deadline" | "obligation" | "key_clause";
  category: string;
  title: string;
  explanation: string;
  responsible_party: string;
  trigger: string;
  period: string;
  due_date: string;
  suggested_action: string;
  exact_source_quote: string;
  clause_reference: string;
}

const ANALYSIS_SYSTEM_PROMPT = `You are IntegraX, an elite Senior Legal Counsel and Contract Intelligence AI.
Your job is to thoroughly analyze the provided legal or business agreement and extract ALL notable:
1. "risk": High liabilities, uncapped indemnity, one-sided termination rights, IP forfeitures, heavy liquidated damages, or unfavorable warranty provisions.
2. "deadline": Critical time windows, non-renewal notices (e.g. 60 days before expiration), cure periods for breach (e.g. 14 days), response deadlines.
3. "obligation": Mandatory duties, payment remittances, invoicing rules (e.g. pay within 30 days of invoice), audit covenants, confidentiality mandates.
4. "key_clause": Governing law, arbitration seat and rules, intellectual property ownership, assignment, force majeure.

CRITICAL EXTRACTION RULES:
- "exact_source_quote": MUST be an EXACT, WORD-FOR-WORD excerpt copied verbatim from the document text. Do NOT modify, summarize, or alter words, because our engine runs deterministic character verification against the PDF text stream.
- "due_date": If a deadline is triggered by an event without an explicit calendar date (e.g., "within 30 days of receiving invoice"), you MUST set "due_date" to "Unresolved". NEVER invent calendar dates.
- Return a valid JSON array of finding objects with the exact schema below.

JSON Schema:
[
  {
    "id": "fnd-1",
    "type": "risk",
    "category": "e.g. Indemnity & Liability, Termination, Payment Terms, Dispute Resolution, Intellectual Property",
    "title": "Clear concise headline of finding",
    "explanation": "Clear plain-language explanation of what this means and why it matters",
    "responsible_party": "e.g. Vendor, Client, Licensee, Both Parties, Defaulting Party",
    "trigger": "Event or condition that activates this term",
    "period": "Allotted time or grace window (e.g. 30 calendar days, 15 business days)",
    "due_date": "Unresolved",
    "suggested_action": "Practical legal redline or operational recommendation",
    "exact_source_quote": "VERBATIM quote copied from text",
    "clause_reference": "e.g. Clause 18.3, Section 7(b), or Article IV"
  }
]`;

/**
 * Allowed high-throughput text & multimodal models in strict priority order.
 * Prioritizes latest stable flash models that support both text and visual PDF OCR.
 */
const ALLOWED_MODEL_PRIORITIES = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
];

const EXCLUDED_PATTERNS = [
  "tts",
  "image",
  "audio",
  "embed",
  "bidi",
  "realtime",
  "learnlm",
  "aqa",
  "gemini-2.5-flash", // Deprecated / 404 for new users
];

/**
 * Dynamically queries Google Generative Language API for models active on this API key.
 * Strictly excludes non-text models (TTS, Image generation, Audio, Embeddings)
 * and limits candidates to the top 2 models to avoid burning rate limit quotas.
 */
export async function getWorkingGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const cleanKey = apiKey.replace(/^["']|["']$/g, "").trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });

    if (res.ok) {
      const data = await res.json();
      if (data?.models && Array.isArray(data.models)) {
        const available = data.models
          .filter((m: any) => 
            Array.isArray(m.supportedGenerationMethods) && 
            m.supportedGenerationMethods.includes("generateContent")
          )
          .map((m: any) => m.name.replace(/^models\//, ""))
          .filter((name: string) => {
            const lower = name.toLowerCase();
            return !EXCLUDED_PATTERNS.some((pat) => lower.includes(pat));
          });

        const prioritized: string[] = [];
        for (const preferred of ALLOWED_MODEL_PRIORITIES) {
          if (available.includes(preferred)) {
            prioritized.push(preferred);
          }
        }

        // Add any remaining clean flash/pro models
        for (const model of available) {
          if (!prioritized.includes(model)) {
            prioritized.push(model);
          }
        }

        if (prioritized.length > 0) {
          // Take at most the top 2 models to prevent burning rate limits
          return prioritized.slice(0, 2);
        }
      }
    }
  } catch (err) {
    console.warn("Dynamic model discovery failed, using fallback order:", err);
  }

  return ["gemini-flash-latest", "gemini-flash-lite-latest"];
}

/**
 * Extracts and parses JSON array from raw model text response.
 * Handles root arrays `[...]` and object-wrapped payloads `{ "findings": [...] }`.
 */
function parseFindingsJson(rawText: string): GeminiFindingOutput[] | null {
  if (!rawText || !rawText.trim()) return null;

  // 1. Clean markdown code fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```$/im, "")
    .trim();

  // 2. Direct JSON attempt
  try {
    const parsed = JSON.parse(cleaned);
    const extracted = normalizeParsedArray(parsed);
    if (extracted && extracted.length > 0) return extracted;
  } catch {
    // Continue
  }

  // 3. Extract bracketed array substring [...]
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      const slice = cleaned.substring(firstBracket, lastBracket + 1);
      const parsed = JSON.parse(slice);
      const extracted = normalizeParsedArray(parsed);
      if (extracted && extracted.length > 0) return extracted;
    } catch {
      // Continue
    }
  }

  // 4. Extract braced object substring {...}
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      const slice = cleaned.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(slice);
      const extracted = normalizeParsedArray(parsed);
      if (extracted && extracted.length > 0) return extracted;
    } catch {
      // Continue
    }
  }

  return null;
}

function normalizeParsedArray(parsed: any): GeminiFindingOutput[] | null {
  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed as GeminiFindingOutput[];
  }

  if (parsed && typeof parsed === "object") {
    const candidates = [
      parsed.findings,
      parsed.clauses,
      parsed.items,
      parsed.results,
      parsed.data,
      parsed.contract_analysis,
      parsed.analysis,
    ];

    for (const c of candidates) {
      if (Array.isArray(c) && c.length > 0) {
        return c as GeminiFindingOutput[];
      }
    }

    for (const val of Object.values(parsed)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
        return val as GeminiFindingOutput[];
      }
    }
  }

  return null;
}

/**
 * Analyzes document with Google Gemini API.
 * Supports digital text stream analysis and multimodal PDF inline data (for scanned/image-based documents).
 */
export async function analyzeLegalDocumentWithGemini(
  documentText: string,
  apiKey: string,
  pdfBuffer?: Buffer
): Promise<GeminiFindingOutput[]> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Missing Gemini API Key. Please provide an API key in settings or .env.local.");
  }

  const cleanKey = apiKey.replace(/^["']|["']$/g, "").trim();
  const genAI = new GoogleGenerativeAI(cleanKey);

  // Discover active models dynamically
  const modelNames = await getWorkingGeminiModels(cleanKey);
  console.log("Using Gemini model priority order:", modelNames.slice(0, 4));

  // Determine if we should use multimodal PDF ingestion
  const isSparseOrScanned = !documentText || documentText.trim().length < 350 || documentText.includes("could not be decoded");
  const useMultimodalPdf = Boolean(pdfBuffer && (isSparseOrScanned || pdfBuffer.length < 12 * 1024 * 1024));

  let lastError: any = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      let contentPayload: any;
      if (useMultimodalPdf && pdfBuffer) {
        contentPayload = [
          {
            inlineData: {
              data: pdfBuffer.toString("base64"),
              mimeType: "application/pdf",
            },
          },
          {
            text: `${ANALYSIS_SYSTEM_PROMPT}\n\nPlease OCR and thoroughly analyze the attached legal contract to extract all risks, deadlines, obligations, and key clauses in the required JSON array schema.`,
          },
        ];
      } else {
        contentPayload = `${ANALYSIS_SYSTEM_PROMPT}\n\nDOCUMENT CONTENT TO ANALYZE:\n${documentText.slice(0, 50000)}`;
      }

      const result = await model.generateContent(contentPayload);
      const text = result.response.text();

      const findings = parseFindingsJson(text);
      if (findings && findings.length > 0) {
        console.log(`Successfully extracted ${findings.length} findings with model: ${modelName}`);
        return findings;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.warn(`Attempt with ${modelName} (JSON mode) failed:`, errMsg);
      lastError = err;

      // Abort immediately on Google Free-Tier 429 rate limit
      if (errMsg.includes("429") || errMsg.includes("Quota exceeded")) {
        console.warn(`Google 429 Rate Limit hit. Aborting model loop to preserve quota.`);
        throw new Error("Google Gemini Free-Tier Rate Limit reached (429: Too Many Requests). Google limits free keys to ~5-15 requests/minute. Please wait 30 seconds before retrying.");
      }

      // If model not found (404), skip standard retry and try next model
      if (errMsg.includes("404") || errMsg.includes("not found")) {
        continue;
      }

      // Retry without responseMimeType in case model rejects JSON mode config
      try {
        const fallbackModel = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.1,
          },
        });

        let contentPayload: any;
        if (useMultimodalPdf && pdfBuffer) {
          contentPayload = [
            {
              inlineData: {
                data: pdfBuffer.toString("base64"),
                mimeType: "application/pdf",
              },
            },
            {
              text: `${ANALYSIS_SYSTEM_PROMPT}\n\nPlease analyze the attached legal contract and return ONLY the JSON array of findings.`,
            },
          ];
        } else {
          contentPayload = `${ANALYSIS_SYSTEM_PROMPT}\n\nDOCUMENT CONTENT TO ANALYZE:\n${documentText.slice(0, 50000)}`;
        }

        const result = await fallbackModel.generateContent(contentPayload);
        const text = result.response.text();

        const findings = parseFindingsJson(text);
        if (findings && findings.length > 0) {
          console.log(`Successfully extracted ${findings.length} findings with model: ${modelName} (standard mode)`);
          return findings;
        }
      } catch (fallbackErr: any) {
        const fallbackMsg = fallbackErr?.message || String(fallbackErr);
        console.warn(`Attempt with ${modelName} (standard mode) also failed:`, fallbackMsg);
        lastError = fallbackErr;

        if (fallbackMsg.includes("429") || fallbackMsg.includes("Quota exceeded")) {
          throw new Error("Google Gemini Free-Tier Rate Limit reached (429: Too Many Requests). Google limits free keys to ~5-15 requests/minute. Please wait 30 seconds before retrying.");
        }
      }
    }
  }

  throw lastError || new Error("Failed to extract findings with any available Gemini model.");
}
