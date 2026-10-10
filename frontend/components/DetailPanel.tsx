"use client";

import React, { useState, useRef, useEffect } from "react";
import { Finding, ChatMessage } from "../types/document";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  FileSearch, 
  Calendar, 
  ArrowRightCircle, 
  UserCheck, 
  Quote, 
  Clock, 
  MessageSquareText, 
  Scale, 
  Download
} from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { sendLegalQuery } from "../lib/chatService";

interface DetailPanelProps {
  finding: Finding | null;
  documentTitle: string;
  onDownloadPdf?: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ 
  finding, 
  documentTitle,
  onDownloadPdf 
}) => {
  const [activeView, setActiveView] = useState<"analysis" | "chat">("analysis");
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize contextual chat whenever a new finding is selected
  useEffect(() => {
    if (finding) {
      setChatHistory([
        {
          id: `init-${finding.id}`,
          sender: "assistant",
          content: `Viewing "${finding.title}" (${finding.clause_reference || "Selected Clause"}). Ask for a plain-language summary, risk assessment, or a redline counter-clause.`,
          timestamp: "Just now",
          referencedClause: finding.clause_reference,
        },
      ]);
    }
  }, [finding?.id]);

  useEffect(() => {
    if (activeView === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping, activeView]);

  const handleCopyQuote = () => {
    if (finding?.exact_source_quote) {
      navigator.clipboard.writeText(finding.exact_source_quote);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !finding) return;

    const queryText = inputMessage.trim();
    setInputMessage("");

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setActiveView("chat");

    try {
      const res = await sendLegalQuery(queryText, {
        title: finding.title,
        clause: finding.clause_reference,
        quote: finding.exact_source_quote,
      });

      const botMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        jargonExplanation: res.jargonExplanation,
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          sender: "assistant",
          content: "Unable to process query. Please check your internet connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!finding) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-white">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <FileSearch className="w-8 h-8 text-neutral-400 stroke-1" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">Select a Finding to Inspect</h3>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-1.5 leading-relaxed">
          Choose any risk, deadline, or obligation from the left column to view its parameters, verbatim source quote, and strategic redline.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header & Sub-Navigation with generous padding */}
      <div className="p-6 sm:p-8 border-b border-neutral-200/80 bg-white flex-shrink-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-200">
              {finding.clause_reference || "Contract Term"}
            </span>
            <span className="text-xs font-semibold text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200">
              {finding.category}
            </span>
          </div>

          {/* Verification Status */}
          {finding.verification_status === "verified" ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-semibold font-mono">
              <CheckCircle2 className="w-4 h-4 text-neutral-900" />
              <span>Grounded in Source (p.{finding.page_number || 1})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold font-mono">
              <AlertTriangle className="w-4 h-4 text-neutral-800" />
              <span>Unverified Substring</span>
            </div>
          )}
        </div>

        {/* Title & Plain Explanation */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight leading-snug mb-2">
          {finding.title}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
          {finding.explanation}
        </p>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-neutral-100">
          <button
            onClick={() => setActiveView("analysis")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === "analysis"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            Clause Deep Dive & Evidence
          </button>

          <button
            onClick={() => setActiveView("chat")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === "chat"
                ? "bg-neutral-950 text-white shadow-2xs"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clause Assistant ({chatHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with generous breathing room */}
      <div className="flex-1 overflow-y-auto">
        {activeView === "analysis" ? (
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-7">
            {/* 4-Item Parameter Matrix */}
            <div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 font-mono">
                Contractual Parameters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-xl p-4 sm:p-5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 font-mono">
                    <UserCheck className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Responsible Party</span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-neutral-950">
                    {finding.responsible_party || "Mutual"}
                  </p>
                </div>

                <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-xl p-4 sm:p-5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Due Date</span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-neutral-950 flex items-center gap-2">
                    <span>{finding.due_date}</span>
                    {finding.due_date === "Unresolved" && (
                      <span className="text-[10px] text-neutral-600 font-medium border border-neutral-300 px-2 py-0.5 rounded-md bg-white">
                        Conditional Event
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-xl p-4 sm:p-5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 font-mono">
                    <ArrowRightCircle className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Trigger Event</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-snug font-medium">
                    {finding.trigger || "Contract execution and delivery"}
                  </p>
                </div>

                <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-xl p-4 sm:p-5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Grace Period / Notice Window</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-snug font-medium">
                    {finding.period || "Immediate"}
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Action / Redline Recommendation */}
            {finding.suggested_action && (
              <div className="border border-neutral-200/90 rounded-xl p-5 sm:p-6 bg-white shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Strategic Redline Recommendation</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {finding.suggested_action}
                </p>
              </div>
            )}

            {/* VERBATIM SOURCE EVIDENCE BLOCK */}
            <div className="border border-neutral-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-neutral-100/80 px-4 sm:px-5 py-3 border-b border-neutral-200/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-neutral-900" />
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                    Verbatim Source Evidence
                  </span>
                  {finding.page_number && (
                    <span className="text-[11px] font-mono text-neutral-700 bg-white border border-neutral-300 px-2 py-0.5 rounded-md font-semibold">
                      Page {finding.page_number}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyQuote}
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black transition-colors cursor-pointer"
                >
                  {copiedQuote ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-950" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Quote</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 sm:p-6 bg-neutral-950 text-neutral-100 font-mono text-xs sm:text-sm leading-relaxed border-l-4 border-l-black">
                "{finding.exact_source_quote}"
              </div>

              <div className="px-4 sm:px-5 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>
                  Grounding Match:{" "}
                  <strong className="text-neutral-900">
                    {finding.verification_status === "verified" ? "Confirmed Verbatim (100%)" : "Approximate Match"}
                  </strong>
                </span>
                <span>PDF Sheet #{finding.page_number || 1}</span>
              </div>
            </div>

            <DisclaimerBanner compact />

            {/* Quick Export Action */}
            {onDownloadPdf && (
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-200">
                <span className="text-xs text-neutral-500">
                  Export verified contractual findings and evidence quotes:
                </span>
                <button
                  onClick={onDownloadPdf}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full PDF Report</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* CLAUSE ASSISTANT CHAT VIEW */
          <div className="p-6 sm:p-8 flex flex-col h-full justify-between">
            <div className="space-y-4 max-w-2xl">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-neutral-950 text-white ml-8 shadow-xs"
                      : "bg-neutral-50 border border-neutral-200 text-neutral-900 mr-8 shadow-2xs"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.jargonExplanation && (
                    <div className="mt-3 p-3 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-800">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-950 mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Legal Term: {msg.jargonExplanation.term}</span>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">{msg.jargonExplanation.definition}</p>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 font-mono ${msg.sender === "user" ? "text-neutral-400" : "text-neutral-400"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 italic inline-flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
                  <span>Synthesizing legal analysis...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Clause Query Bar */}
      <div className="p-4 sm:p-5 border-t border-neutral-200/80 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2.5">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask about ${finding.clause_reference || "this clause"} (e.g. 'explain simply', 'suggest redline')...`}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white text-neutral-900 placeholder-neutral-400 font-sans transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
