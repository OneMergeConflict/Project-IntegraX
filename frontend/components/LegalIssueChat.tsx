"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert, 
  MessageSquareText, 
  Scale, 
  FileText,
  Bookmark,
  Building2,
  Landmark,
  Gavel
} from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { sendLegalQuery } from "../lib/chatService";
import { ALL_LEGAL_ENTRIES } from "../lib/legalKnowledgeBase";

interface ChatItem {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  statuteReference?: string;
  categoryTag?: string;
  commercialImpact?: string;
  jargonExplanation?: { term: string; definition: string };
}

const PRESET_TOPICS = [
  { label: "Article 15 (Constitution)", query: "What is Article 15 of the Indian Constitution?" },
  { label: "Article 14 (Tender Arbitrariness)", query: "How does Article 14 apply to government tenders and contracts?" },
  { label: "Article 19(1)(g) (Freedom of Trade)", query: "What is Article 19(1)(g) and reasonable restrictions on business?" },
  { label: "Energy Watchdog (Force Majeure)", query: "Explain the ruling in Energy Watchdog v. CERC on Force Majeure and Section 56" },
  { label: "Kailash Nath (Liquidated Damages)", query: "What is the precedent in Kailash Nath Associates v. DDA regarding proof of loss under Section 74?" },
  { label: "Percept D'Mark (Non-Compete)", query: "Can non-compete clauses be enforced under Section 27 according to Percept D'Mark v Zaheer Khan?" },
  { label: "BALCO (Arbitration Seat)", query: "What did BALCO v Kaiser Aluminium establish regarding foreign-seated arbitration?" },
  { label: "Swiss Ribbons (IBC Validity)", query: "Explain the landmark ratio in Swiss Ribbons v. Union of India under the IBC" },
];

export const LegalIssueChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "intro-1",
      sender: "assistant",
      content: "Hello! I am the IntegraX Legal Intelligence Assistant. I am equipped with the complete Constitution of India (Fundamental Rights, Articles 14, 15, 19, 21, 299, 300A, 301), landmark Supreme Court business rulings (Energy Watchdog, Kailash Nath, Percept D'Mark, BALCO, Vodafone, Tata Cellular), and commercial statutes. Ask any legal or constitutional question for an instant, plain-language analysis.",
      timestamp: "Just now",
      categoryTag: "System Initialized",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatItem = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput("");
    setIsTyping(true);

    try {
      const res = await sendLegalQuery(textToSend);

      const botMessage: ChatItem = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        statuteReference: res.statuteReference,
        categoryTag: res.categoryTag,
        commercialImpact: undefined,
        jargonExplanation: res.jargonExplanation,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          sender: "assistant",
          content: "Encountered an unexpected error processing query. Falling back to local offline mode.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
            Entry Point 2
          </span>
          <span className="text-xs text-neutral-500">Legal Intelligence & Case Law Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight flex items-center gap-2">
          <Landmark className="w-6 h-6 text-neutral-950" />
          <span>Ask About a Legal Issue or Indian Precedent</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Instant answers on the Constitution of India (Articles 14, 15, 19, 21, 299, 300A), landmark Supreme Court business rulings, and statutory doctrines.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Preset Topics Quick Chips */}
      <div className="mt-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            Instant Precedents & Constitutional Articles:
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            Click to query instantly
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(topic.query)}
              className="text-left p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs transition-all hover:border-neutral-400 group"
            >
              <span className="font-semibold text-neutral-950 block text-[11px] truncate group-hover:underline">
                {topic.label}
              </span>
              <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                {topic.query}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-neutral-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-lg text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-neutral-950 text-white"
                    : "bg-white border border-neutral-200 text-neutral-900 shadow-2xs"
                }`}
              >
                {/* Category Header Badge */}
                {m.categoryTag && m.sender === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-100">
                    <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center gap-1">
                      <Gavel className="w-3 h-3 text-neutral-900" />
                      <span>{m.categoryTag}</span>
                    </span>
                    {m.statuteReference && (
                      <span className="text-[11px] font-mono font-medium text-neutral-600 truncate">
                        {m.statuteReference}
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line prose-neutral">{m.content}</div>

                {/* Statutory Reference Badge */}
                {m.statuteReference && !m.categoryTag && (
                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-mono text-neutral-700">
                    <Scale className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Citation: {m.statuteReference}</span>
                  </div>
                )}

                {/* Plain English Legal Jargon Definition */}
                {m.jargonExplanation && (
                  <div className="mt-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded text-[11px] text-neutral-800">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-950 mb-1">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-950" />
                      <span>Legal Jargon Defined: {m.jargonExplanation.term}</span>
                    </div>
                    <p className="text-neutral-600 leading-normal">{m.jargonExplanation.definition}</p>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="p-3 bg-white border border-neutral-200 rounded-md text-xs text-neutral-600 italic inline-flex items-center gap-2 shadow-2xs">
              <div className="w-3 h-3 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              <span>Querying Constitutional Articles and Supreme Court Precedents...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-3.5 bg-white border-t border-neutral-200 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Article 15, Article 14, Energy Watchdog, Kailash Nath, or Indian contract doctrines..."
            className="flex-1 text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:border-neutral-950 text-neutral-950 placeholder-neutral-400 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
