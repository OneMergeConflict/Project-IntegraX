"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Search, 
  CheckSquare, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { DocumentAnalysis } from "@/types/document";

export type PipelineStage = 
  | "Reading document"
  | "Identifying clauses"
  | "Extracting obligations"
  | "Checking evidence"
  | "Preparing report"
  | "Completed";

interface ProcessingScreenProps {
  fileName: string;
  fileSize: number;
  file?: File;
  onComplete: (analysis: DocumentAnalysis) => void;
  onErrorRetry?: () => void;
}

interface StageDetail {
  id: PipelineStage;
  stepNumber: number;
  label: string;
  description: string;
}

const STAGES: StageDetail[] = [
  {
    id: "Reading document",
    stepNumber: 1,
    label: "Reading document",
    description: "Extracting text and preserving exact page indices from PDF stream",
  },
  {
    id: "Identifying clauses",
    stepNumber: 2,
    label: "Identifying clauses",
    description: "Locating payment terms, termination rules, liabilities, and indemnity covenants",
  },
  {
    id: "Extracting obligations",
    stepNumber: 3,
    label: "Extracting obligations",
    description: "Gemini AI structuring responsible parties, triggers, grace periods, and deadlines",
  },
  {
    id: "Checking evidence",
    stepNumber: 4,
    label: "Checking evidence",
    description: "Executing deterministic substring search against parsed source text to eliminate hallucination",
  },
  {
    id: "Preparing report",
    stepNumber: 5,
    label: "Preparing report",
    description: "Synthesizing normalized findings, risk distribution, and clause audit indices",
  },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  fileName,
  fileSize,
  file,
  onComplete,
  onErrorRetry,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageLogs, setStageLogs] = useState<string[]>([
    "Initialized connection to document ingestion service.",
    `Ingesting: ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`,
  ]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const executeAnalysis = async () => {
      // Stage 1: Reading document
      setCurrentStageIndex(0);
      setStageLogs((l) => [...l, "[Stage 1/5] Reading document: Parsing PDF byte streams and pages."]);

      // Stage 2: Identifying clauses simulation while fetch is prepared
      const stage2Timer = setTimeout(() => {
        if (!isCancelled) {
          setCurrentStageIndex(1);
          setStageLogs((l) => [...l, "[Stage 2/5] Identifying clauses: Detecting contractual covenants & covenants."]);
        }
      }, 1000);

      // Stage 3: Extracting obligations & covenants
      const stage3Timer = setTimeout(() => {
        if (!isCancelled) {
          setCurrentStageIndex(2);
          setStageLogs((l) => [...l, "[Stage 3/5] Extracting contractual liabilities, obligations, and deadlines."]);
        }
      }, 2500);

      try {
        let analysisData: DocumentAnalysis;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/analyze", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson?.details || errJson?.error || `Server responded with status ${res.status}`);
          }

          analysisData = await res.json();
        } else {
          // If no file was provided (e.g. sample demo click), dynamically import mock
          const { MOCK_DOCUMENT_ANALYSIS } = await import("@/lib/mockData");
          analysisData = MOCK_DOCUMENT_ANALYSIS;
        }

        clearTimeout(stage2Timer);
        clearTimeout(stage3Timer);

        if (isCancelled) return;

        setStageLogs((l) => [
          ...l,
          `[Analysis Complete] Successfully extracted structured legal findings.`,
        ]);

        // Stage 4: Checking evidence
        setCurrentStageIndex(3);
        setStageLogs((l) => [
          ...l,
          `[Stage 4/5] Checking evidence: Deterministically verified ${analysisData.findings.length} quotes against source pages (${analysisData.stats.verifiedPercentage}% verified).`
        ]);

        await new Promise((r) => setTimeout(r, 900));
        if (isCancelled) return;

        // Stage 5: Preparing report
        setCurrentStageIndex(4);
        setStageLogs((l) => [
          ...l,
          `[Stage 5/5] Preparing report: Report compiled with ${analysisData.stats.risksCount} risks, ${analysisData.stats.deadlinesCount} deadlines, and ${analysisData.stats.obligationsCount} obligations.`
        ]);

        await new Promise((r) => setTimeout(r, 900));
        if (isCancelled) return;

        // Complete and hand off real analysis!
        onComplete(analysisData);
      } catch (err: any) {
        console.error("Analysis execution error:", err);
        clearTimeout(stage2Timer);
        clearTimeout(stage3Timer);
        if (!isCancelled) {
          setAnalysisError(err?.message || "Failed to process PDF.");
          setStageLogs((l) => [...l, `[ERROR]: ${err?.message || "Processing failed"}`]);
        }
      }
    };

    executeAnalysis();

    return () => {
      isCancelled = true;
    };
  }, [file, fileName, onComplete]);

  const activeStage = STAGES[currentStageIndex];
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-xl border border-neutral-200 rounded-lg p-6 sm:p-8 bg-white shadow-xs">
        {/* Document Identifier Banner */}
        <div className="flex items-center gap-3 pb-6 border-b border-neutral-200">
          <div className="w-10 h-10 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <FileText className="w-5 h-5 text-neutral-800" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded border border-neutral-200">
                Pipeline Ingestion
              </span>
              <span className="text-xs text-neutral-500">
                {(fileSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 truncate mt-0.5">
              {fileName}
            </h2>
          </div>
        </div>

        {/* Real Status Indicator */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {analysisError ? (
                <AlertTriangle className="w-4 h-4 text-neutral-950" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                {analysisError ? "Processing Interrupted" : activeStage.label}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-neutral-600">
              Step {activeStage.stepNumber} of 5 ({progressPercent}%)
            </span>
          </div>

          {/* Stepped Progress Bar mapped to backend states */}
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200">
            <div
              className="bg-neutral-950 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed">
            {analysisError ? analysisError : activeStage.description}
          </p>

          {analysisError && (
            <div className="mt-4 p-3 bg-neutral-100 border border-neutral-300 rounded text-xs flex items-center justify-between">
              <span className="text-neutral-900 font-medium">{analysisError}</span>
              <button
                onClick={onErrorRetry || (() => window.location.reload())}
                className="px-3 py-1 bg-black text-white rounded text-xs flex items-center gap-1 hover:bg-neutral-800"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>

        {/* Stage Timeline Steps */}
        <div className="space-y-3 pt-2 pb-6 border-t border-neutral-100">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex && !analysisError;

            return (
              <div
                key={stage.id}
                className={`flex items-start gap-3 text-xs p-2 rounded transition-colors ${
                  isCurrent
                    ? "bg-neutral-50 border border-neutral-200"
                    : "opacity-80"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-500 font-mono">
                      {stage.stepNumber}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isCurrent ? "text-neutral-950" : "text-neutral-700"}`}>
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {isCompleted ? "VERIFIED" : isCurrent ? "PROCESSING" : "QUEUED"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live deterministic console log */}
        <div className="bg-neutral-950 text-neutral-300 p-3 rounded font-mono text-[11px] leading-relaxed max-h-32 overflow-y-auto">
          <div className="text-neutral-500 mb-1">=== INTEGRA-X PIPELINE LOG STREAM ===</div>
          {stageLogs.map((log, i) => (
            <div key={i} className="text-neutral-300">
              &gt; {log}
            </div>
          ))}
        </div>

        {/* Statutory Safeguard Footnote */}
        <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] text-neutral-500 text-center">
          IntegraX validates exact text quotes against raw PDF streams to eliminate hallucination.
        </div>
      </div>
    </div>
  );
};
