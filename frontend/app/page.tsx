"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { UploadDropzone } from "../components/UploadDropzone";
import { ProcessingScreen } from "../components/ProcessingScreen";
import { DashboardView } from "../components/DashboardView";
import { LawyerDirectory } from "../components/LawyerDirectory";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { MOCK_DOCUMENT_ANALYSIS } from "../lib/mockData";
import { 
  FileText, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  CheckSquare, 
  Lock, 
  Sparkles,
  Phone,
  Mail,
  Scale
} from "lucide-react";

import { UploadedFilePayload } from "../components/UploadDropzone";
import { DocumentAnalysis } from "../types/document";

export default function IntegraXApp() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "home" | "lawyers">("home");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysis>(MOCK_DOCUMENT_ANALYSIS);
  const [uploadedFile, setUploadedFile] = useState<UploadedFilePayload>({
    name: "MSA_Apex_Global_Technologies_v4.2.pdf",
    size: 2485120,
  });

  const handleFileUpload = (payload: UploadedFilePayload) => {
    setUploadedFile(payload);
    setIsProcessing(true);
  };

  const handleProcessingComplete = (realAnalysis?: DocumentAnalysis) => {
    if (realAnalysis) {
      setCurrentAnalysis(realAnalysis);
    }
    setIsProcessing(false);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Global Sterile Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentTitle={currentAnalysis.title || uploadedFile.name}
      />

      {/* Main Container View Switcher */}
      <main className="flex-1 flex flex-col">
        {isProcessing ? (
          <ProcessingScreen
            fileName={uploadedFile.name}
            fileSize={uploadedFile.size}
            file={uploadedFile.file}
            onComplete={handleProcessingComplete}
          />
        ) : activeTab === "dashboard" ? (
          <DashboardView
            analysis={currentAnalysis}
            onUploadNew={() => setActiveTab("home")}
          />
        ) : activeTab === "lawyers" ? (
          <LawyerDirectory />
        ) : (
          /* HOME SCREEN: Clean 2-Way Legal Workflow */
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
            {/* Header / Intro */}
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 text-xs font-mono mb-3 border border-neutral-200">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                <span>Deterministic Evidence Grounding • Indian Commercial Law</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
                Legal and Business Document Intelligence
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
                IntegraX analyzes contracts, extracts liabilities, deadlines, and covenants, deterministically verifies quotes against original PDF text streams, and connects you to Bar Council advocates.
              </p>
            </div>

            <DisclaimerBanner />

            {/* The 2 Primary Entry Points Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
              {/* PRIMARY ENTRY POINT: Review a Document (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded font-semibold">
                      Primary Entry Point
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      Step 1 - 5 Pipeline
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-neutral-950 tracking-tight">
                    Review a Document
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 mb-6 leading-relaxed">
                    Upload your contract or agreement in PDF format. IntegraX extracts clauses, verifies verbatim quotes against page text, and compiles a downloadable audit report.
                  </p>

                  {/* Drag-and-drop dropzone */}
                  <UploadDropzone onFileUpload={handleFileUpload} />
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Supported: PDF (Commercial Contracts, SOWs, NDAs)</span>
                  <span className="font-mono">Max size: 50MB</span>
                </div>
              </div>

              {/* SECONDARY ENTRY POINT: Find a Lawyer (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col">
                {/* Find a lawyer Card */}
                <div 
                  onClick={() => setActiveTab("lawyers")}
                  className="h-full bg-white border border-neutral-300 hover:border-neutral-900 rounded-xl p-6 sm:p-8 cursor-pointer transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2.5 py-0.5 rounded border border-neutral-300 font-semibold">
                        Advocate Network
                      </span>
                      <Users className="w-4 h-4 text-neutral-700 group-hover:text-black transition-colors" />
                    </div>

                    <h3 className="text-xl font-bold text-neutral-950 tracking-tight">
                      Find a Commercial Advocate
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                      Connect with Bar Council verified advocates across Delhi, Mumbai, Bengaluru, Hyderabad, and Chennai. Access direct chamber phones, official email addresses, and retainer fee schedules.
                    </p>

                    <div className="mt-6 space-y-2.5 text-xs font-mono text-neutral-700">
                      <div className="bg-neutral-50 border border-neutral-200/90 p-3 rounded-lg flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-800" />
                        <span>Direct Chamber Telephone Access</span>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200/90 p-3 rounded-lg flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-neutral-800" />
                        <span>High Court & Commercial Bench Counsel</span>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200/90 p-3 rounded-lg flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-neutral-800" />
                        <span>Transparent Retainer Fee Schedules</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-900 group-hover:translate-x-0.5 transition-transform">
                    <span>Search Advocate Directory</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Minimal Monochrome Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <div>
            © 2026 IntegraX Technologies. Modern Legal Document Intelligence.
          </div>
          <div className="text-[11px]">
            Strict Deterministic Source Grounding Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
