import { extractText } from "unpdf";

export interface ParsedPdfResult {
  numPages: number;
  text: string;
  pages: { pageNumber: number; text: string }[];
}

/**
 * Clean and sanitize extracted text from PDF streams:
 * - Removes null bytes, non-printable control characters, and Unicode replacement characters
 * - Normalizes excessive whitespace and linebreaks
 */
export function sanitizePdfText(raw: string): string {
  if (!raw) return "";
  return raw
    // Strip null characters and control characters except \n and \t
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/g, " ")
    // Collapse 3+ newlines to 2
    .replace(/\n{3,}/g, "\n\n")
    // Collapse multiple spaces
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Extracts clean, human-readable text and page chunks from a PDF Buffer
 * using unpdf (serverless & bundler-safe PDF engine with zero external worker dependencies).
 */
export async function extractPdfText(buffer: Buffer): Promise<ParsedPdfResult> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const { totalPages, text } = await extractText(uint8Array, { mergePages: false });

    const pagesArray = Array.isArray(text) ? text : [text];
    const pages: { pageNumber: number; text: string }[] = [];

    for (let i = 0; i < pagesArray.length; i++) {
      const pageClean = sanitizePdfText(pagesArray[i] || "");
      pages.push({
        pageNumber: i + 1,
        text: pageClean,
      });
    }

    const fullCleanText = pages.map((p) => p.text).filter(Boolean).join("\n\n");

    return {
      numPages: totalPages || pages.length || 1,
      text: fullCleanText,
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullCleanText }],
    };
  } catch (error) {
    console.error("PDF text extraction error via unpdf:", error);

    // Fail gracefully with a clear message rather than ever dumping raw binary zlib bytes!
    return {
      numPages: 1,
      text: "The document could not be decoded. It may be encrypted or scanned without an embedded text layer.",
      pages: [
        {
          pageNumber: 1,
          text: "The document could not be decoded. It may be encrypted or scanned without an embedded text layer.",
        },
      ],
    };
  }
}
