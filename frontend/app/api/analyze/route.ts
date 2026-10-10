import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdfExtractor";
import { analyzeLegalDocumentWithGemini } from "@/lib/gemini";
import {
  extractClausesHeuristically,
  normalizeDocumentFindings,
} from "@/lib/analysisPipeline";

export const maxDuration = 60; // Allow sufficient time for LLM document extraction

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customApiKey = (formData.get("customApiKey") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: Parse & Chunk strictly preserving page numbers
    const parsedPdf = await extractPdfText(buffer);
    const pages = parsedPdf.pages;
    const fullDocText = pages
      .map((p) => `[PAGE ${p.pageNumber}]\n${p.text}`)
      .join("\n\n");

    const docTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const effectiveApiKey =
      customApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let rawFindings: any[] = [];
    let usedProvider = "heuristic_engine";
    let geminiDiagnostic: string | null = null;

    const hasApiKey = Boolean(effectiveApiKey && effectiveApiKey.trim().length > 5);

    // Step 2: LLM Extraction (Structured JSON Output via Google Gemini API)
    if (hasApiKey) {
      try {
        console.log(`Analyzing document with Google Gemini API (Key length: ${effectiveApiKey!.trim().length})...`);
        rawFindings = await analyzeLegalDocumentWithGemini(fullDocText, effectiveApiKey!.trim(), buffer);
        usedProvider = "gemini_api";
        console.log(`Gemini successfully extracted ${rawFindings.length} findings.`);
      } catch (geminiError: any) {
        geminiDiagnostic = geminiError?.message || String(geminiError);
        console.warn("Gemini extraction error, falling back to heuristic engine:", geminiDiagnostic);
      }
    }

    // Fallback if no API key was provided or Gemini returned empty
    if (!rawFindings || rawFindings.length === 0) {
      console.log(`Extracting clauses using local engine (hasApiKey: ${hasApiKey}, diagnostic: ${geminiDiagnostic || "none"})...`);
      rawFindings = extractClausesHeuristically(pages, geminiDiagnostic, hasApiKey);
      usedProvider = "local_heuristic";
    }

    // Step 3 & 4: Deterministic Evidence Verification and Normalization
    const analysis = normalizeDocumentFindings(
      rawFindings,
      pages,
      docTitle,
      file.name,
      file.size
    );

    // Attach provider metadata & diagnostics
    (analysis as any).provider = usedProvider;
    (analysis as any).geminiError = geminiDiagnostic;

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("PDF analysis route error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document", details: error?.message },
      { status: 500 }
    );
  }
}
