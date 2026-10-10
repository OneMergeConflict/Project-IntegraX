"use client";

import React from "react";
import { ShieldAlert, Info } from "lucide-react";

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 text-xs text-neutral-600 bg-neutral-50 border-t border-neutral-200">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-neutral-800" />
        <span>
          <strong>Legal Notice:</strong> IntegraX provides AI-generated insights for informational purposes. This does not replace advice from a qualified advocate.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-700 flex items-start gap-3">
      <ShieldAlert className="w-4 h-4 mt-0.5 text-neutral-900 flex-shrink-0" />
      <div className="leading-relaxed">
        <span className="font-semibold text-neutral-900 mr-1.5 uppercase tracking-wider text-[11px]">
          Statutory Safeguard:
        </span>
        IntegraX provides AI-generated insights for informational purposes. This does not replace advice from a qualified advocate. Indian legal statutes (e.g. Contract Act, 1872 / Arbitration Act, 1996) are referenced only where strictly applicable to document terms.
      </div>
    </div>
  );
};
