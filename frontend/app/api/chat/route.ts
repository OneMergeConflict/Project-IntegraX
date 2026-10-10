import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { queryLegalKnowledge } from "@/lib/legalKnowledgeBase";
import { getWorkingGeminiModels } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { message, contextFinding, customApiKey } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing query message" }, { status: 400 });
    }

    const rawApiKey =
      customApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // 1. If Gemini API Key is present, call Google Gemini SDK with dynamic model discovery
    if (rawApiKey && rawApiKey.trim().length > 5) {
      const cleanKey = rawApiKey.replace(/^["']|["']$/g, "").trim();
      const genAI = new GoogleGenerativeAI(cleanKey);

      const systemPrompt = `You are IntegraX Legal Intelligence Assistant, an expert AI for Indian commercial law, the Constitution of India, and corporate contract analysis.
Strict Guidelines:
1. Explain in clear, plain language that is easily understood by business executives and advocates.
2. If legal jargon is used, identify it and provide a concise, plain-English definition.
3. When discussing Indian constitutional provisions (like Article 14, 15, 19(1)(g), 21, 299, 300A), explain both the constitutional text and commercial/business impact.
4. When discussing commercial contracts, reference landmark Indian precedents (e.g., Energy Watchdog, Kailash Nath, Percept D'Mark, BALCO) if relevant.
5. Do NOT invent statutes or case citations.
6. Contextual clause info: ${contextFinding ? JSON.stringify(contextFinding) : "None"}`;

      const candidateModels = await getWorkingGeminiModels(cleanKey);

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1200,
            },
          });

          const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${message}`);
          const candidateText = result.response.text();

          if (candidateText && candidateText.trim().length > 0) {
            return NextResponse.json({
              reply: candidateText,
              isLiveAi: true,
              categoryTag: `Live Gemini AI Engine (${modelName})`,
              statuteReference: "Real-time AI Synthesis",
            });
          }
        } catch (geminiError: any) {
          console.warn(`Chat attempt with ${modelName} failed:`, geminiError?.message || geminiError);
        }
      }
    }

    // 2. Local Knowledge Base Matcher (Zero API key required - Works instantly on GitHub clone)
    const localMatch = queryLegalKnowledge(message);
    if (localMatch) {
      return NextResponse.json({
        reply: `### ${localMatch.title}\n\n**Statutory Summary:**\n${localMatch.summary}\n\n**Legal Analysis & Framework:**\n${localMatch.fullExplanation}\n\n**Commercial & Business Impact:**\n${localMatch.commercialImpact}`,
        isLiveAi: false,
        statuteReference: localMatch.citationOrArticle,
        categoryTag: localMatch.category,
        jargonExplanation: localMatch.jargonTerm
          ? {
              term: localMatch.jargonTerm,
              definition: localMatch.jargonDefinition || "",
            }
          : undefined,
      });
    }

    // 3. Fallback General Commercial Legal Synthesis
    return NextResponse.json({
      reply: `Under Indian commercial law for query "${message}": Obligations are governed under the Indian Contract Act, 1872 and applicable constitutional standards. For government tenders and PSU agreements, Article 14 bars arbitrariness (*Tata Cellular*), and Article 299 requires formal execution in the name of the President/Governor. You can ask specifically about Article 14, 15, 19, 21, 299, 300A, or case laws like Energy Watchdog or Kailash Nath.`,
      isLiveAi: false,
      statuteReference: "Indian Commercial Jurisprudence",
      categoryTag: "Verified Local Legal Base",
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Internal chat engine error", details: error?.message },
      { status: 500 }
    );
  }
}
