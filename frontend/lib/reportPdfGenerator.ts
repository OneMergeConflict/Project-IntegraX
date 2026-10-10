import { jsPDF } from "jspdf";
import { DocumentAnalysis, Finding } from "../types/document";

/**
 * Sanitizes string for standard PDF WinAnsi / Latin-1 typography.
 * Replaces typographic quotes, dashes, symbols, and unsupported Unicode chars
 * to avoid encoding corruption in jsPDF standard fonts.
 */
function cleanText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'") // Single smart quotes
    .replace(/[\u201C\u201D]/g, '"') // Double smart quotes
    .replace(/[\u2013\u2014]/g, "-") // En & em dashes
    .replace(/[\u2026]/g, "...")     // Ellipsis
    .replace(/[\u2022\u25CF\u25AA]/g, "*") // Bullets
    .replace(/₹/g, "INR ")           // Rupee symbol
    .replace(/[^\x20-\x7E\r\n\t]/g, "") // Keep standard ASCII range
    .trim();
}

/**
 * Generates an executive, publication-grade monochromatic PDF audit report
 * for an analyzed legal/business document.
 */
export function generateAnalysisPdfReport(analysis: DocumentAnalysis): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const marginTop = 18;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginX * 2; // 178mm

  let currentY = marginTop;

  // Running header for subsequent pages
  const drawRunningHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("INTEGRAX | DOCUMENT INTELLIGENCE AUDIT REPORT", marginX, 10);
    doc.setFont("helvetica", "normal");
    const docShortTitle = cleanText(analysis.title || analysis.fileName).slice(0, 45);
    doc.text(docShortTitle, pageWidth - marginX, 10, { align: "right" });
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(marginX, 12, pageWidth - marginX, 12);
  };

  // Helper to ensure enough space on page or create a new page
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginTop;
      drawRunningHeader();
    }
  };

  // --- 1. COVER / MASTHEAD (PAGE 1) ---
  doc.setFillColor(17, 24, 39); // Deep dark neutral
  doc.rect(marginX, currentY, contentWidth, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("INTEGRAX", marginX + 6, currentY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(209, 213, 219);
  doc.text("CONTRACT INTELLIGENCE & LEGAL RISK AUDIT REPORT", marginX + 6, currentY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(243, 244, 246);
  const reportDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(`DATE: ${reportDate}`, pageWidth - marginX - 6, currentY + 9, { align: "right" });
  doc.text(`ID: ${cleanText(analysis.id).slice(0, 18)}`, pageWidth - marginX - 6, currentY + 16, { align: "right" });

  currentY += 28;

  // --- 2. DOCUMENT METADATA BOX ---
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, currentY, contentWidth, 30, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  const displayTitle = cleanText(analysis.title || analysis.fileName);
  doc.text(displayTitle.slice(0, 75), marginX + 5, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  
  // Left column in metadata box
  const firstParty = cleanText(analysis.parties?.firstParty || "Not explicitly designated");
  const secondParty = cleanText(analysis.parties?.secondParty || "Not explicitly designated");
  doc.text(`First Party: ${firstParty.slice(0, 38)}`, marginX + 5, currentY + 14);
  doc.text(`Second Party: ${secondParty.slice(0, 38)}`, marginX + 5, currentY + 20);
  const governingLaw = cleanText(analysis.parties?.governingLaw || "Laws of India / Standard Jurisdiction");
  doc.text(`Jurisdiction: ${governingLaw.slice(0, 38)}`, marginX + 5, currentY + 26);

  // Right column in metadata box
  const rightColX = marginX + contentWidth / 2 + 5;
  doc.text(`Pages Analyzed: ${analysis.pageCount || 1}`, rightColX, currentY + 14);
  doc.text(`Risk Score: ${analysis.riskScore || 0}/100`, rightColX, currentY + 20);
  doc.text(`Evidence Verification: ${analysis.stats?.verifiedPercentage || 100}% Verbatim`, rightColX, currentY + 26);

  currentY += 36;

  // --- 3. METRICS SUMMARY BAR ---
  const boxCount = 4;
  const boxGap = 3;
  const boxW = (contentWidth - boxGap * (boxCount - 1)) / boxCount;
  const boxH = 16;

  const metricCards = [
    { label: "CRITICAL RISKS", count: analysis.stats?.risksCount || 0 },
    { label: "DEADLINES", count: analysis.stats?.deadlinesCount || 0 },
    { label: "OBLIGATIONS", count: analysis.stats?.obligationsCount || 0 },
    { label: "KEY CLAUSES", count: analysis.stats?.keyClausesCount || 0 },
  ];

  metricCards.forEach((card, idx) => {
    const bX = marginX + idx * (boxW + boxGap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.roundedRect(bX, currentY, boxW, boxH, 1, 1, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(17, 24, 39);
    doc.text(String(card.count), bX + boxW / 2, currentY + 7, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(107, 114, 128);
    doc.text(card.label, bX + boxW / 2, currentY + 12.5, { align: "center" });
  });

  currentY += boxH + 7;

  // --- 4. EXECUTIVE SUMMARY SECTION ---
  if (analysis.summary) {
    ensureSpace(32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text("EXECUTIVE AUDIT SUMMARY", marginX, currentY);
    currentY += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    const cleanedSummary = cleanText(analysis.summary);
    const summaryLines = doc.splitTextToSize(cleanedSummary, contentWidth);
    doc.text(summaryLines, marginX, currentY);
    currentY += summaryLines.length * 4.2 + 6;
  }

  // Divider
  ensureSpace(6);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY, marginX + contentWidth, currentY);
  currentY += 6;

  // --- 5. DETAILED AUDIT FINDINGS SECTION ---
  ensureSpace(14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(17, 24, 39);
  doc.text(`EXTRACTED FINDINGS & CLAUSE INTELLIGENCE (${analysis.findings?.length || 0})`, marginX, currentY);
  currentY += 6;

  const findings = analysis.findings || [];

  findings.forEach((finding, index) => {
    const titleText = cleanText(finding.title);
    const explanationText = cleanText(finding.explanation);
    const actionText = cleanText(finding.suggested_action);
    // Limit very long quotes to avoid multi-page single card overflow
    const rawQuote = cleanText(finding.exact_source_quote);
    const quoteText = rawQuote.length > 500 ? rawQuote.slice(0, 500) + "..." : rawQuote;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const titleLines = doc.splitTextToSize(titleText, contentWidth - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const expLines = doc.splitTextToSize(explanationText, contentWidth - 10);
    const actionLines = actionText ? doc.splitTextToSize(actionText, contentWidth - 10) : [];
    const quoteLines = quoteText ? doc.splitTextToSize(`"${quoteText}"`, contentWidth - 16) : [];

    // Calculate precise card height
    let cardHeight = 8; // Top strip
    cardHeight += titleLines.length * 4.2 + 2; // Title
    cardHeight += expLines.length * 3.8 + 3; // Explanation
    if (actionLines.length > 0) {
      cardHeight += 4 + actionLines.length * 3.8 + 2; // Action section
    }
    cardHeight += 11; // Parameter row
    let qBoxH = 0;
    if (quoteLines.length > 0) {
      qBoxH = quoteLines.length * 3.5 + 7;
      cardHeight += qBoxH + 4;
    }
    cardHeight += 3; // Bottom padding

    ensureSpace(cardHeight);

    const blockStartY = currentY;

    // Outer card container
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginX, blockStartY, contentWidth, cardHeight, 1.5, 1.5, "FD");

    // Header strip within card
    doc.setFillColor(243, 244, 246);
    doc.rect(marginX, blockStartY, contentWidth, 7, "F");

    // Finding Index & Type badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(17, 24, 39);
    const typeLabel = (finding.type || "finding").toUpperCase();
    doc.text(`#${index + 1}  [${typeLabel}]`, marginX + 3, blockStartY + 4.8);

    // Clause Reference / Category
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    const refText = cleanText(finding.clause_reference || finding.category || "Section");
    doc.text(refText.slice(0, 45), marginX + 45, blockStartY + 4.8);

    // Verification Status indicator on right
    const isVerified = finding.verification_status === "verified";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    if (isVerified) {
      doc.setTextColor(22, 101, 52); // Dark green
      doc.text("[VERIFIED EVIDENCE]", pageWidth - marginX - 3, blockStartY + 4.8, { align: "right" });
    } else {
      doc.setTextColor(107, 114, 128);
      doc.text("[STANDARD CLAUSE]", pageWidth - marginX - 3, blockStartY + 4.8, { align: "right" });
    }

    let innerY = blockStartY + 11.5;

    // Finding Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(titleLines, marginX + 5, innerY);
    innerY += titleLines.length * 4.2 + 2;

    // Explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.text(expLines, marginX + 5, innerY);
    innerY += expLines.length * 3.8 + 3;

    // Suggested Action / Redline (if present)
    if (actionLines.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(17, 24, 39);
      doc.text("Strategic Guidance:", marginX + 5, innerY);
      innerY += 3.8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(31, 41, 55);
      doc.text(actionLines, marginX + 5, innerY);
      innerY += actionLines.length * 3.8 + 3;
    }

    // Party / Trigger / Due Date 3-column micro row
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(marginX + 4, innerY, contentWidth - 8, 8, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(107, 114, 128);
    doc.text("PARTY:", marginX + 6, innerY + 5.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(cleanText(finding.responsible_party || "All Parties").slice(0, 24), marginX + 18, innerY + 5.2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("TRIGGER:", marginX + 65, innerY + 5.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(cleanText(finding.trigger || "Execution").slice(0, 26), marginX + 80, innerY + 5.2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("TIMELINE:", marginX + 125, innerY + 5.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(17, 24, 39);
    const dateText = cleanText(finding.due_date && finding.due_date !== "Unresolved" ? finding.due_date : finding.period || "Ongoing");
    doc.text(dateText.slice(0, 20), marginX + 140, innerY + 5.2);

    innerY += 10;

    // Verbatim Source Quote Box (if present)
    if (quoteLines.length > 0) {
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginX + 4, innerY, contentWidth - 8, qBoxH, 1, 1, "FD");

      // Left vertical accent bar
      doc.setFillColor(17, 24, 39);
      doc.rect(marginX + 4, innerY, 1.2, qBoxH, "F");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(75, 85, 99);
      doc.text(quoteLines, marginX + 8, innerY + 4);

      // Quote Citation tag
      const pageInfo = finding.page_number ? ` [Page ${finding.page_number}]` : "";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Original Document Verbatim Excerpt${pageInfo}`,
        marginX + contentWidth - 7,
        innerY + qBoxH - 1.8,
        { align: "right" }
      );
    }

    currentY = blockStartY + cardHeight + 4;
  });

  // --- 6. STATUTORY DISCLAIMER SECTION (FINAL PAGE) ---
  ensureSpace(26);
  currentY += 4;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 20, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text("STATUTORY LEGAL DISCLAIMER", marginX + 5, currentY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(107, 114, 128);
  const disclaimer = 
    "IntegraX provides automated contract intelligence and analysis for informational reference only. " +
    "This audit report does not constitute formal legal counsel or create an advocate-client relationship under the " +
    "Advocates Act, 1961. Contractual interpretation may vary based on governing case law and specific commercial context. " +
    "Verify all findings and evidence excerpts against the fully executed instruments before executing amendments or making commercial commitments.";
  const disLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
  doc.text(disLines, marginX + 5, currentY + 9);

  // --- 7. RUNNING FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text("INTEGRAX AI * CONFIDENTIAL DOCUMENT AUDIT", marginX, pageHeight - 8);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: "right" });
  }

  // Generate safe filename and trigger download
  const sanitizedName = (analysis.fileName || "document")
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 40);
  const fileName = `${sanitizedName}_IntegraX_Audit_Report.pdf`;

  doc.save(fileName);
}
