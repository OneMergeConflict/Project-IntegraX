"use client";

import React, { useState, useEffect } from "react";
import { DocumentAnalysis, Finding, FindingType } from "../types/document";
import { FindingsList } from "./FindingsList";
import { DetailPanel } from "./DetailPanel";
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  Download,
  ShieldAlert,
  Clock,
  CheckSquare,
  BookOpen
} from "lucide-react";
import { generateAnalysisPdfReport } from "../lib/reportPdfGenerator";

interface DashboardViewProps {
  analysis: DocumentAnalysis;
  onUploadNew: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analysis,
  onUploadNew,
}) => {
  // Always guarantee selected finding is active and synced
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(
    analysis?.findings?.[0] || null
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      setTimeout(() => {
        generateAnalysisPdfReport(analysis);
        setIsGeneratingPdf(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2500);
      }, 100);
    } catch (err) {
      console.error("Failed to generate PDF report:", err);
      setIsGeneratingPdf(false);
    }
  };

  // Sync selected finding whenever analysis updates
  useEffect(() => {
    if (analysis?.findings && analysis.findings.length > 0) {
      setSelectedFinding(analysis.findings[0]);
    } else {
      setSelectedFinding(null);
    }
  }, [analysis?.id, analysis?.findings]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Document Executive Summary & Quick Action Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            {/* Left: Breadcrumb, Document Title & Metadata */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <button
                  onClick={onUploadNew}
                  className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-black font-semibold transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Upload Document</span>
                </button>
                <span className="text-neutral-300">/</span>
                <span className="font-mono text-neutral-400">Audit Intelligence</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  {analysis.title || analysis.fileName}
                </h1>
                <span className="inline-flex items-center text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                  {analysis.pageCount} {analysis.pageCount === 1 ? "page" : "pages"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{analysis.stats.verifiedPercentage}% Grounded</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-3xl">
                Uploaded: {analysis.uploadedAt || "Recently analyzed"} • File: {analysis.fileName} ({Math.round((analysis.fileSizeBytes || 0) / 1024)} KB)
              </p>
            </div>

            {/* Right: Primary Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                title="Download full legal intelligence report as PDF"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Report Downloaded!</span>
                  </>
                ) : isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Report (PDF)</span>
                  </>
                )}
              </button>

              <button
                onClick={onUploadNew}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-neutral-200"
              >
                <Upload className="w-4 h-4 text-neutral-700" />
                <span>Upload New</span>
              </button>
            </div>
          </div>

          {/* 4 Metric Summary Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Risks Detected</span>
                <ShieldAlert className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                {analysis.stats.risksCount}
              </div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Liabilities & indemnity clauses
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Deadlines</span>
                <Clock className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                {analysis.stats.deadlinesCount}
              </div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Notice, cure & renewal windows
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Obligations</span>
                <CheckSquare className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                {analysis.stats.obligationsCount}
              </div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Mandatory party duties
              </span>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Source Grounding</span>
                <CheckCircle2 className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                {analysis.stats.verifiedPercentage}%
              </div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Verbatim cross-matched text
              </span>
            </div>
          </div>

          {/* Executive Summary Paragraph */}
          {analysis.summary && (
            <div className="mt-5 p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              <span className="font-bold text-neutral-950 mr-2">Executive Summary:</span>
              {analysis.summary}
            </div>
          )}
        </div>

        {/* Spacious 2-Column Split Workspace */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] lg:h-[calc(100vh-14rem)]">
          {/* Left Column: Findings Navigator (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 h-full overflow-hidden flex flex-col border-r border-neutral-200/80 bg-white">
            <FindingsList
              analysis={analysis}
              selectedFindingId={selectedFinding?.id || ""}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />
          </div>

          {/* Right Column: Deep Clause Details & Assistant (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 h-full overflow-hidden flex flex-col bg-white">
            <DetailPanel
              finding={selectedFinding}
              documentTitle={analysis.title}
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
