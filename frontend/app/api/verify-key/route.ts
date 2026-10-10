import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWorkingGeminiModels } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawApiKey = (body?.apiKey as string) || "";

    const keyToTest =
      rawApiKey.trim() ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!keyToTest || keyToTest.length < 8) {
      return NextResponse.json(
        { 
          valid: false, 
          error: "API key is missing or too short. A Google Gemini API key typically starts with 'AIzaSy...'." 
        },
        { status: 400 }
      );
    }

    // Strip accidental quotes or surrounding brackets
    const cleanKey = keyToTest.replace(/^["']|["']$/g, "").trim();
    const genAI = new GoogleGenerativeAI(cleanKey);

    // Discover active models dynamically (e.g. gemini-3.8-flash, etc.)
    const testModels = await getWorkingGeminiModels(cleanKey);
    let lastError: any = null;

    for (const modelName of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Respond with 'OK' if you receive this connection check.");
        const reply = result.response.text();

        if (reply && reply.length > 0) {
          return NextResponse.json({
            valid: true,
            model: modelName,
            message: `Connected successfully! Google Gemini model '${modelName}' is active and operational.`,
          });
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    const errorDetails = lastError?.message || "Unable to authenticate with Google Gemini.";
    return NextResponse.json(
      { 
        valid: false, 
        error: errorDetails.includes("API_KEY_INVALID") 
          ? "API Key is invalid or expired. Please check your key at Google AI Studio."
          : errorDetails 
      },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err?.message || "Unexpected server error during verification." },
      { status: 500 }
    );
  }
}
