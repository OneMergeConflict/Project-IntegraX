# ⚖️ IntegraX — Legal & Business Document Intelligence Platform

> **A contract analysis and legal risk mitigation platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, Prisma, and Python.**

IntegraX deterministically verifies verbatim quotes against PDF text streams to eliminate AI hallucinations, structures complex contract obligations, detects risk exposure, and connects users with verified legal counsel across India.

---

## ⚡ Quick Start: How to Run Locally on Your Laptop

You can get IntegraX up and running locally in **less than 2 minutes**. It is configured to run out-of-the-box with **zero required API keys**.

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* **[Node.js](https://nodejs.org/)** (v18.17.0 or higher recommended, e.g., v20.x or v22.x)
* **npm** (comes bundled with Node.js)
* **[Git](https://git-scm.com/)**

---

### Step 1: Clone the Repository
Open your terminal (PowerShell, Command Prompt, or Bash) and clone the project:

```bash
git clone https://github.com/OneMergeConflict/Project-IntegraX.git
cd Project-IntegraX
```

---

### Step 2: Install Frontend Dependencies
Navigate into the `frontend` directory and install the packages:

```bash
cd frontend
npm install
```

> *Tip: Alternatively, from the root folder, you can run:*
> ```bash
> npm run install:all
> ```

---

### Step 3: Start the Development Server
Launch the local development server:

```bash
npm run dev
```

---

### Step 4: Open in Your Browser
Once the dev server starts, open your browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

🎉 **You are now running IntegraX locally!**

---

## 🖥️ What You Can Test in the Application

### 1. 📄 Upload & Contract Audit
* **Drag & Drop any PDF contract** into the upload area.
* Or click **"Load Sample Contract"** to immediately test with a commercial Master Services Agreement (MSA) containing indemnities, liabilities, and termination clauses.
* Experience the **multi-stage audit pipeline** showing live analysis phases:
  * *Reading Document*
  * *Identifying Clauses*
  * *Extracting Obligations*
  * *Checking Evidence*
  * *Preparing Legal Report*

### 2. 🔍 Deterministic Quote & Clause Verification
* Browse categorized findings: **Risks**, **Deadlines**, **Obligations**, and **Key Clauses**.
* Review the **Responsible Party**, **Statutory Legal Doctrines** (e.g., Indian Contract Act 1872 Sections 27, 73, 74), and **Recommended Action Steps**.
* Inspect verbatim clause quotations verified against parsed document pages with exact character match offsets.

### 3. 📥 Download as PDF Report
* On the audit results screen, click the **"Download Report (PDF)"** button in the top-right toolbar.
* Exports a formatted legal audit summary with risk assessment, key obligations, critical deadlines, and mitigation recommendations.

### 4. 👨‍⚖️ Find Lawyers (Verified Advocate Directory)
* Switch to the **"Find Lawyers"** tab in the navigation bar.
* Search Advocates by name, firm, or specialization (*Corporate Law, Contract Review, Commercial Arbitration, Intellectual Property, Employment & Labour, Real Estate*).
* Filter advocates across major Indian jurisdictions: **Mumbai**, **New Delhi**, **Bengaluru**, **Hyderabad**, **Chennai**, and **Kolkata**.
* **Direct Contact:** Quick-action **Email** (`mailto:`) and **Call** (`tel:`) buttons with one-click clipboard copying.
* **Book Consultation:** Click *"Request Consultation"* to open the consultation intake modal for urgent contract reviews.

---

## 🗄️ (Optional) Supabase Database Setup

IntegraX includes a full Prisma ORM schema configured for Supabase PostgreSQL (`Document`, `DocumentPage`, `Finding`, `ChatMessage`, `AdvocateDirectory`).

If you wish to connect your own Supabase instance:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Supabase connection string in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
   ```
3. Push the database schema to Supabase:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

---

## 🐍 (Optional) Standalone Python Backend

For developers wishing to run the PyMuPDF document extraction backend independently:

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 📁 Repository Structure

```
Project-IntegraX/
├── frontend/                     # Next.js 16 Web Application
│   ├── app/
│   │   ├── globals.css           # Styling, typography & design tokens
│   │   ├── layout.tsx            # Global layout & metadata
│   │   └── page.tsx              # Application shell (Dashboard & Lawyer Directory)
│   ├── components/
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── UploadDropzone.tsx    # Drag-and-drop PDF uploader
│   │   ├── ProcessingScreen.tsx  # Multi-stage audit progress screen
│   │   ├── FindingsList.tsx      # Risk overview, filters & findings tabs
│   │   ├── DetailPanel.tsx       # In-depth clause breakdown & verbatim quote viewer
│   │   ├── LawyerDirectory.tsx   # Verified Bar Council advocate search & contact
│   │   └── DisclaimerBanner.tsx  # Legal notice & statutory disclaimer
│   ├── lib/
│   │   ├── mockData.ts           # Commercial contract dataset & lawyer records
│   │   └── pdfGenerator.ts       # Client-side PDF audit report generator
│   └── types/
│       └── document.ts           # TypeScript interfaces & types
│
├── backend/                      # Python FastAPI Service (Optional)
│   ├── app/
│   │   ├── main.py               # REST API endpoints
│   │   ├── pipeline.py           # PyMuPDF parser & deterministic text chunker
│   │   └── schemas.py            # Pydantic data models
│   └── requirements.txt          # Python dependencies
│
├── prisma/
│   └── schema.prisma             # Supabase PostgreSQL database schema
├── .env.example                  # Environment configuration template
├── package.json                  # Root npm configuration & workspace scripts
└── README.md                     # Documentation & setup guide
```

---

## ❓ Troubleshooting

| Issue | Resolution |
| :--- | :--- |
| **Port 3000 is already in use** | Run `npm run dev -- -p 3001` or specify another available port. |
| **Node.js version warning** | Check your version with `node -v`. Install Node.js v18.17 or higher from [nodejs.org](https://nodejs.org/). |
| **Scanned PDF text not showing** | Ensure the uploaded PDF contains a digital text layer (OCR). Or test with the included *"Load Sample Contract"* button. |
| **Execution Policy Error on Windows (PowerShell)** | If running `Activate.ps1` gives a script policy error, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` or use Git Bash. |

---

## ⚖️ Legal Disclaimer
IntegraX provides automated contract intelligence and analytical findings for informational purposes only. It does not constitute formal legal advice. Users are encouraged to consult qualified legal counsel registered with the Bar Council of India for formal legal representation.
