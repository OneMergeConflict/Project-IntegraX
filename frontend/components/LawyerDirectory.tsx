"use client";

import React, { useState } from "react";
import { MOCK_ADVOCATES } from "../lib/mockData";
import { Advocate } from "../types/document";
import { 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Calendar, 
  ArrowUpRight,
  Filter,
  Building,
  Scale,
  X
} from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner";

export const LawyerDirectory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedAdvocateForModal, setSelectedAdvocateForModal] = useState<Advocate | null>(null);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    matterType: "Contract Review & Risk Mitigation",
    notes: "",
  });

  const filteredAdvocates = MOCK_ADVOCATES.filter((adv) => {
    const matchesSearch = 
      adv.name.toLowerCase().includes(search.toLowerCase()) ||
      adv.specialization.toLowerCase().includes(search.toLowerCase()) ||
      adv.firm.toLowerCase().includes(search.toLowerCase()) ||
      adv.city.toLowerCase().includes(search.toLowerCase()) ||
      (adv.chamberAddress && adv.chamberAddress.toLowerCase().includes(search.toLowerCase()));
    const matchesCity = selectedCity === "All" || adv.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSubmitted(true);
    setTimeout(() => {
      setConsultationSubmitted(false);
      setSelectedAdvocateForModal(null);
      setConsultationForm({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        matterType: "Contract Review & Risk Mitigation",
        notes: "",
      });
    }, 2200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
            Advocate Network
          </span>
          <span className="text-xs text-neutral-500">Verified Indian Bar Council Directory</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
          Find a Commercial Advocate & Legal Counsel
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Direct contact details, chamber addresses, and retainer fee schedules for Bar Council-verified advocates specializing in corporate contracts, commercial dispute arbitration, and liability capping.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Filter and Search Bar */}
      <div className="mt-6 mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by advocate name, firm, specialization, court, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-950 text-neutral-950 placeholder-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs px-3 py-2.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-950 text-neutral-900 cursor-pointer"
          >
            <option value="All">All Jurisdictions (India)</option>
            <option value="New Delhi">New Delhi (Delhi HC / SC)</option>
            <option value="Bengaluru">Bengaluru (Karnataka HC)</option>
            <option value="Mumbai">Mumbai (Bombay HC)</option>
            <option value="Hyderabad">Hyderabad (Telangana HC)</option>
            <option value="Chennai">Chennai (Madras HC)</option>
          </select>
        </div>
      </div>

      {/* Advocates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAdvocates.map((adv) => (
          <div
            key={adv.id}
            className="bg-white border border-neutral-300 rounded-lg p-5 flex flex-col justify-between hover:border-neutral-900 transition-all shadow-2xs hover:shadow-sm"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">{adv.name}</h3>
                  <p className="text-xs text-neutral-600 font-medium">{adv.firm}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-900 bg-neutral-100 border border-neutral-300 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-neutral-900 text-neutral-900" />
                  <span>{adv.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Bar Council Verification badge & Standing */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                  <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                  <span>BCI: {adv.barCouncilId}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-600 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200">
                  {adv.experienceYears} Years Standing
                </span>
              </div>

              {/* Specialization & Practice Courts */}
              <div className="space-y-2 text-xs text-neutral-700 mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-800 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{adv.specialization}</span>
                </div>
                {adv.practiceCourts && adv.practiceCourts.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Scale className="w-3.5 h-3.5 text-neutral-800 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-600">
                      {adv.practiceCourts.join(" • ")}
                    </span>
                  </div>
                )}
              </div>

              {/* CONTACT DETAILS SECTION */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 mb-4 space-y-2.5">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
                  Chamber Contact Details
                </div>

                {/* Direct Phone */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-900">
                    <Phone className="w-3.5 h-3.5 text-neutral-700 flex-shrink-0" />
                    <a
                      href={`tel:${adv.phone.replace(/[\s-]/g, "")}`}
                      className="font-mono font-semibold hover:underline"
                    >
                      {adv.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(adv.phone, `phone-${adv.id}`)}
                    className="p-1 text-neutral-500 hover:text-black rounded"
                    title="Copy Phone Number"
                  >
                    {copiedField === `phone-${adv.id}` ? (
                      <Check className="w-3 h-3 text-neutral-950" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Contact Email */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-900 truncate mr-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-700 flex-shrink-0" />
                    <a
                      href={`mailto:${adv.contactEmail}?subject=Commercial Contract Review Inquiry - IntegraX`}
                      className="truncate hover:underline text-[11px]"
                    >
                      {adv.contactEmail}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(adv.contactEmail, `email-${adv.id}`)}
                    className="p-1 text-neutral-500 hover:text-black rounded flex-shrink-0"
                    title="Copy Email"
                  >
                    {copiedField === `email-${adv.id}` ? (
                      <Check className="w-3 h-3 text-neutral-950" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Physical Chamber Address */}
                <div className="flex items-start gap-2 text-[11px] text-neutral-600 pt-1 border-t border-neutral-200/60">
                  <MapPin className="w-3.5 h-3.5 text-neutral-700 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{adv.chamberAddress}</span>
                </div>

                {/* Fee Schedule */}
                {adv.consultationFee && (
                  <div className="text-[10px] font-mono text-neutral-700 bg-white border border-neutral-200 px-2 py-1 rounded">
                    Est. Retainer: <strong>{adv.consultationFee}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Direct Call, Email & Request Consultation */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${adv.phone.replace(/[\s-]/g, "")}`}
                  className="py-1.5 px-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Chamber</span>
                </a>
                <a
                  href={`mailto:${adv.contactEmail}?subject=Contract Consultation Request - IntegraX`}
                  className="py-1.5 px-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3 h-3" />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedAdvocateForModal(adv)}
                disabled={!adv.isAvailable}
                className="w-full py-2 px-3 bg-neutral-950 hover:bg-neutral-850 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Request Document Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Consultation Request Dialog Modal */}
      {selectedAdvocateForModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 rounded-lg max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedAdvocateForModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-900 px-2 py-0.5 rounded border border-neutral-300">
                Official Advocate Retainer Inquiry
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-1">
                Consult with {selectedAdvocateForModal.name}
              </h2>
              <p className="text-xs text-neutral-600">
                {selectedAdvocateForModal.firm} • {selectedAdvocateForModal.city}
              </p>
            </div>

            {consultationSubmitted ? (
              <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-md text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-neutral-950 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-950">Inquiry Dispatched Successfully</h3>
                <p className="text-xs text-neutral-600">
                  Your contract briefing has been relayed to {selectedAdvocateForModal.name}'s chamber. Their associate will contact you at {consultationForm.clientEmail || "your email"} within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={consultationForm.clientName}
                      onChange={(e) => setConsultationForm({ ...consultationForm, clientName: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={consultationForm.clientPhone}
                      onChange={(e) => setConsultationForm({ ...consultationForm, clientPhone: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-neutral-950 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Your Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.in"
                    value={consultationForm.clientEmail}
                    onChange={(e) => setConsultationForm({ ...consultationForm, clientEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Matter Scope
                  </label>
                  <select
                    value={consultationForm.matterType}
                    onChange={(e) => setConsultationForm({ ...consultationForm, matterType: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-neutral-950"
                  >
                    <option value="Contract Review & Risk Mitigation">Contract Review & Risk Mitigation</option>
                    <option value="Indemnity & Liability Capping">Indemnity & Liability Capping</option>
                    <option value="Dispute Settlement & Arbitration">Dispute Settlement & Arbitration</option>
                    <option value="Non-Compete & IP Assignment">Non-Compete & IP Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Specific Clauses or Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention specific clauses, deadlines, or risks flagged in your IntegraX audit report..."
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:border-neutral-950 text-neutral-950 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setSelectedAdvocateForModal(null)}
                    className="px-3 py-1.5 text-xs text-neutral-600 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded text-xs font-medium transition-colors"
                  >
                    Submit Consultation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
