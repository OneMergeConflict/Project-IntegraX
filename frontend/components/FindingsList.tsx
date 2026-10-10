"use client";

import React, { useState } from "react";
import { 
  Finding, 
  FindingType, 
  DocumentAnalysis 
} from "../types/document";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  FileText, 
  Clock, 
  ShieldAlert, 
  CheckSquare, 
  BookOpen, 
  X
} from "lucide-react";

interface FindingsListProps {
  analysis: DocumentAnalysis;
  selectedFindingId: string;
  onSelectFinding: (finding: Finding) => void;
}

export const FindingsList: React.FC<FindingsListProps> = ({
  analysis,
  selectedFindingId,
  onSelectFinding,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | FindingType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const findings = analysis?.findings || [];

  const filteredFindings = findings.filter((finding) => {
    const matchesTab = activeTab === "all" || finding.type === activeTab;
    const matchesSearch = 
      searchQuery.trim() === "" ||
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (finding.clause_reference && finding.clause_reference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVerified = !verifiedOnly || finding.verification_status === "verified";

    return matchesTab && matchesSearch && matchesVerified;
  });

  const getCount = (tab: "all" | FindingType): number => {
    if (tab === "all") return findings.length;
    return findings.filter((f) => f.type === tab).length;
  };

  const getTypeIcon = (type: FindingType) => {
    switch (type) {
      case "risk":
        return <ShieldAlert className="w-3.5 h-3.5 text-neutral-900" />;
      case "deadline":
        return <Clock className="w-3.5 h-3.5 text-neutral-900" />;
      case "obligation":
        return <CheckSquare className="w-3.5 h-3.5 text-neutral-900" />;
      case "key_clause":
        return <BookOpen className="w-3.5 h-3.5 text-neutral-900" />;
    }
  };

  const getTypeLabel = (type: FindingType) => {
    switch (type) {
      case "risk": return "Risk";
      case "deadline": return "Deadline";
      case "obligation": return "Obligation";
      case "key_clause": return "Key Clause";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Filter Bar: Tabs & Search */}
      <div className="p-4 sm:p-5 border-b border-neutral-200/80 bg-white space-y-3 flex-shrink-0">
        {/* Sleek Segmented Control Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "all"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <span>All</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeTab === "all" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"
            }`}>
              {getCount("all")}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("risk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "risk"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risks</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeTab === "risk" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"
            }`}>
              {getCount("risk")}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("deadline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "deadline"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Deadlines</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeTab === "deadline" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"
            }`}>
              {getCount("deadline")}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("obligation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "obligation"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Obligations</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeTab === "obligation" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"
            }`}>
              {getCount("obligation")}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("key_clause")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "key_clause"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Key Clauses</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
              activeTab === "key_clause" ? "bg-neutral-800 text-neutral-200" : "bg-neutral-100 text-neutral-600"
            }`}>
              {getCount("key_clause")}
            </span>
          </button>
        </div>

        {/* Minimal Search Input with Verified toggle */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search clauses, terms or parties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 bg-neutral-50/80 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:bg-white text-neutral-900 placeholder-neutral-400 font-sans transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
              verifiedOnly
                ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            }`}
            title="Filter by verified source text only"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verified</span>
          </button>
        </div>
      </div>

      {/* Findings List Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100/90 bg-white">
        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <FileText className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm font-semibold text-neutral-800">No findings match this filter.</p>
            <p className="text-xs text-neutral-500 mt-1">Try clearing your search query or selecting 'All'.</p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setVerifiedOnly(false);
              }}
              className="mt-3 text-xs font-semibold text-neutral-950 underline hover:text-neutral-600 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isSelected = finding.id === selectedFindingId;

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding)}
                className={`p-4 sm:p-5 cursor-pointer transition-all text-left relative ${
                  isSelected
                    ? "bg-neutral-50/95 border-l-4 border-l-black shadow-2xs pl-3.5 sm:pl-4"
                    : "border-l-4 border-l-transparent hover:bg-neutral-50/60"
                }`}
              >
                {/* Meta Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200 font-mono">
                      {getTypeIcon(finding.type)}
                      <span>{getTypeLabel(finding.type)}</span>
                    </span>

                    <span className="text-xs text-neutral-500 font-medium truncate max-w-[160px]">
                      {finding.category}
                    </span>
                  </div>

                  {/* Verification Pill */}
                  {finding.verification_status === "verified" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                      <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                      <span>p.{finding.page_number || 1}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                      <AlertTriangle className="w-3 h-3 text-neutral-700" />
                      <span>Unverified</span>
                    </span>
                  )}
                </div>

                {/* Finding Title */}
                <h3 className="text-sm sm:text-base font-bold text-neutral-950 leading-snug mb-1.5">
                  {finding.title}
                </h3>

                {/* Concise Excerpt */}
                <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-3 font-normal">
                  {finding.explanation}
                </p>

                {/* Footer Micro-Specs */}
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-2.5 border-t border-neutral-100/90 font-mono">
                  <span className="truncate">
                    Party: <strong className="text-neutral-800">{finding.responsible_party || "Mutual"}</strong>
                  </span>
                  {finding.clause_reference && (
                    <span className="truncate ml-2 text-neutral-700 font-medium">
                      {finding.clause_reference}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
