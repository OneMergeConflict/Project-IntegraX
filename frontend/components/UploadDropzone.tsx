"use client";

import React, { useState, useRef } from "react";
import { Upload, FileUp, FileText, CheckCircle2 } from "lucide-react";

export interface UploadedFilePayload {
  name: string;
  size: number;
  file?: File;
}

interface UploadDropzoneProps {
  onFileUpload: (filePayload: UploadedFilePayload) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a PDF document (.pdf)");
      return;
    }

    onFileUpload({
      name: file.name,
      size: file.size,
      file: file,
    });
  };

  const handleLoadSampleDocument = () => {
    onFileUpload({
      name: "MSA_Apex_Global_Technologies_v4.2.pdf",
      size: 2485120, // 2.37 MB
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Drag-and-drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-neutral-900 bg-neutral-50 scale-[1.005]"
            : "border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-900 transition-transform group-hover:scale-105">
          <Upload className="w-6 h-6 stroke-[1.75]" />
        </div>

        <h3 className="text-base font-bold text-neutral-950 mb-1">
          Drag & Drop your Legal Document (PDF)
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-5 leading-relaxed">
          Upload Commercial Contracts, NDAs, Master Service Agreements, Commercial Leases, or Terms of Service.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all shadow-xs">
          <FileUp className="w-3.5 h-3.5" />
          <span>Browse PDF File</span>
        </div>
      </div>

      {/* Quick Sample Document Preset */}
      <div className="flex items-center justify-between text-xs text-neutral-600 px-1 pt-1">
        <span className="text-neutral-500">Need a sample to inspect immediately?</span>
        <button
          onClick={handleLoadSampleDocument}
          className="font-semibold text-neutral-950 underline hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Load Enterprise MSA Demo PDF</span>
        </button>
      </div>
    </div>
  );
};
