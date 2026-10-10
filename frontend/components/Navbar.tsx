"use client";

import React from "react";
import { 
  FileText, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Upload
} from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "home" | "lawyers";
  setActiveTab: (tab: "dashboard" | "home" | "lawyers") => void;
  documentTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  documentTitle = "MSA_Apex_Global_Technologies_v4.2.pdf",
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded font-semibold text-sm tracking-tighter shadow-2xs">
              IX
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-black block leading-none">
                IntegraX
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block mt-0.5">
                Doc Intelligence
              </span>
            </div>
          </button>

          {/* Current Document indicator if viewing dashboard */}
          {activeTab === "dashboard" && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-neutral-200 text-xs">
              <span className="text-neutral-500">Active Document:</span>
              <span className="font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded max-w-[240px] truncate border border-neutral-200">
                {documentTitle}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-800 bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-neutral-900" />
                Verified Grounding
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs & Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "home"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Analysis Report</span>
          </button>

          <button
            onClick={() => setActiveTab("lawyers")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "lawyers"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Find Lawyer</span>
          </button>

          {/* Quick Upload action */}
          <button
            onClick={() => setActiveTab("home")}
            className="ml-2 hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload PDF</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
