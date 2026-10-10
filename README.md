# IntegraX — Legal & Business Document Intelligence Platform

> **A next-generation contract intelligence platform built with Next.js 16 (App Router), Tailwind CSS, Python (FastAPI), PyMuPDF, and PostgreSQL.**

IntegraX deterministically verifies verbatim quotes against PDF text streams to eliminate hallucinations, structures complex contract obligations, and provides clause-level assistant intelligence grounded in Indian commercial jurisprudence.

---

## 🚀 How to Run Locally from GitHub (Zero Configuration Needed!)

IntegraX is architected with a **Dual-Mode Intelligence System**:
1. **Zero-Config Instant Mode (Default):** Runs immediately upon cloning with **zero API keys required**. Uses the built-in Indian Constitution (Articles 14, 15, 19, 21, 299, 300A), landmark Supreme Court precedents (*Energy Watchdog*, *Kailash Nath*, *Percept D'Mark*, *BALCO*, *Swiss Ribbons*, *Tata Cellular*), and commercial statutory doctrines.
2. **Live Gemini AI Mode (Optional):** Add a free Google Gemini API key to enable unbounded conversational reasoning on any legal query.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/IntegraX.git
cd IntegraX
```

### Step 2: Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

> **That's it!** The full UI, document processing pipeline demo, analysis report dashboard, evidence quote verification, and legal intelligence chat work out of the box with zero external configuration.

---

## 🔑 (Optional) Enabling Live Gemini AI

If you want the assistant to answer arbitrary, open-ended legal questions beyond the built-in legal knowledge base:

### Option A: Direct In-App Settings (Easiest)
1. Open the app at `http://localhost:3000`.
2. Click the **⚙️ Settings** icon in the top right navigation bar.
3. Paste a free [Google Gemini API Key](https://aistudio.google.com/app/apikey) and click **Save**.
4. The assistant immediately switches to Live AI Mode!

### Option B: `.env.local` File
Create a `frontend/.env.local` file:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
Restart `npm run dev`.

---

## 🐍 (Optional) Running the Python FastAPI Backend

To run the standalone Python backend pipeline:

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
FastAPI Swagger docs will be live at `http://localhost:8000/docs`.

---

## 🏛️ Project Architecture

```
IntegraX/
├── frontend/
│   ├── app/
│   │   ├── api/chat/route.ts       # Next.js API route (Gemini AI + Local Fallback)
│   │   ├── globals.css             # Tailwind CSS tokens & Inter typography
│   │   ├── layout.tsx              # Root Layout
│   │   └── page.tsx                # Home / Dashboard / Chat / Lawyer Directory router
│   ├── components/
│   │   ├── Navbar.tsx              # Monochrome top navigation with AI settings modal
│   │   ├── FindingsList.tsx        # Left Column: Summary stats, tabs, verified badges
│   │   ├── DetailPanel.tsx         # Right Column: Deep details, verbatim quotes, clause chat
│   │   ├── ProcessingScreen.tsx    # Calm 5-stage real pipeline progress state
│   │   ├── UploadDropzone.tsx      # Drag & Drop PDF upload + sample document loader
│   │   ├── LegalIssueChat.tsx      # Entry Point 2: Constitutional & Business Legal Chat
│   │   ├── LawyerDirectory.tsx     # Entry Point 3: Verified Bar Council Advocate search
│   │   └── DisclaimerBanner.tsx    # Statutory legal disclaimer banner
│   ├── lib/
│   │   ├── chatService.ts          # Universal hybrid client chat service
│   │   ├── legalKnowledgeBase.ts   # Constitution of India & Supreme Court case base
│   │   └── mockData.ts             # Normalized commercial MSA contract data
│   └── types/
│       └── document.ts             # Strict TypeScript schemas
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI endpoints (/api/documents, /api/chat)
│   │   ├── pipeline.py             # PyMuPDF parser, chunker, deterministic quote search
│   │   └── schemas.py              # Pydantic data schemas
│   └── requirements.txt            # Python dependencies
│
└── prisma/
    └── schema.prisma               # PostgreSQL schema (Documents, Findings, Chat, Lawyers)
```

---

## ⚖️ Legal Safeguards & Design System Compliance
* **No Blind Hallucinations:** Every quoted clause is verified deterministically against parsed page text. Mismatches are explicitly flagged with `verification_status: "failed"`.
* **Statutory Notice:** All AI outputs include: *"IntegraX provides AI-generated insights for informational purposes. This does not replace advice from a qualified advocate."*
* **Plain Language Guarantee:** Complex legal doctrines (such as Section 74 penalties, Section 27 non-competes, and indemnity caps) are accompanied by plain-English explanations.
