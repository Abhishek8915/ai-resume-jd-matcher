# AI Resume–Job Description Matcher (Practical Assessment MVP)

An interview-defensible, production-grade SaaS application designed to match resumes with job descriptions (JDs). It parses resume text or PDF documents on the server, matches skills against JD specifications via the Google Gemini API, and applies a **deterministic weighted scoring model** programmatically in the backend.

---

## 🌟 Visual & Functional Tour

- **Dual Upload Modalities**: Supports drag-and-drop resume PDF uploads or plain-text copy-pasting. PDF files are parsed directly on the backend server.
- **Dynamic Multi-Stage Loader**: Features progressive loading messages to represent pipeline steps (parsing text, mapping skills, compiling analytics) to maximize user engagement.
- **Radial Match Score Gauge**: An animated SVG-based visual indicator colored dynamically based on suitability (Red for Needs Improvement, Orange for Partial, Teal for Strong, Emerald for Excellent).
- **Comprehensive Scorecard Breakdown**: A clear, visual progress card demonstrating how the final match percentage is derived.
- **Tabbed Skill Intersection Grid**: Splits extraction results into overlapping matched core skills, general missing requirements, and priority-ranked competency gaps (High, Medium, Low).
- **ATS Compatibility Audit**: Features a visual parsing dial checking the resume's compatibility score, structural strengths, formatting issues, and index optimization guidelines.
- **Executive Recruiter Narrative**: A copyable formal assessment summary detailing high/low rating factors alongside specific candidate strengths and actionable resume optimization suggestions.
- **One-Click Professional PDF Exporter**: Generates and downloads a multi-page, elegantly formatted recruitment suitability report directly from the results dashboard.
- **One-Click Case Demos**: Features pre-loaded real-world scenarios (Full-Stack SWE & Data Scientist) so evaluators can try the tool immediately.

---

## 🏗️ Architecture

```
                       ┌────────────────────────┐
                       │  React 19 (Vite) UI    │
                       └───────────┬────────────┘
                                   │
                    (POST Resume PDF/Text & JD Text)
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │   Express API Server   │
                       └───────────┬────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   ┌─────────────────────┐                   ┌─────────────────────┐
   │     pdf-parse       │                   │    lib/llm.ts       │
   │ (PDF text extract)  │                   │ (GoogleGenAI SDK)   │
   └─────────────────────┘                   └──────────┬──────────┘
                                                        │
                                             (Structured Schema JSON)
                                                        │
                                                        ▼
                                             ┌─────────────────────┐
                                             │  gemini-3.5-flash   │
                                             └──────────┬──────────┘
                                                        │
                                                        ▼
                       ┌────────────────────────┐
                       │   src/utils/scoring.ts │
                       │  (Weighted Formula)    │
                       └───────────┬────────────┘
                                   │
                       (JSON Response Payload)
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │  Visualization Panels  │
                       └────────────────────────┘
```

The application is structured as an industry-standard full-stack containerized architecture:
1. **Frontend**: Rendered via **React 19** and compiled via **Vite**. Styling is handled using mobile-first utility patterns with **TailwindCSS**. Icon assets are compiled directly from **Lucide React**. Animations use **Motion** (`motion/react`).
2. **Backend**: Powered by **Express** in Node.js. In production, the backend serves pre-compiled static frontend assets. In development, it proxies hot-rebuilt files via Vite.
3. **AI Layer**: Abstracted through `/lib/llm.ts`, making it simple to swap the underlying model (e.g., from Gemini to OpenAI or Anthropic) without changing application core services. It communicates with the Google Gen AI SDK (`@google/genai`) using structural schema enforcement to ensure type safety.

---

## 📊 Scoring Algorithm

Unlike simple wrappers that let the LLM guess a score (which is non-deterministic and prone to hallucinations), this application implements **deterministic programmatic scoring** inside the backend. The model is only used to extract structural parameters, which are then passed to a strict mathematical formula.

### The Weighted Formula:
- **40% Required Skills Overlap**: Measures the ratio of required JD skills found in the candidate's resume:
  $$\text{Score} = \left( \frac{\text{Matched Skills}}{\text{Total Required JD Skills}} \right) \times 40$$
  *(If the JD specifies no required skills, defaults to full 40 points)*
- **30% Semantic Similarity**: Represents overall role, industry, and background alignment evaluated by the AI as a value from 0.0 to 1.0:
  $$\text{Score} = \text{Similarity} \times 30$$
- **20% Experience Match**: Compares the candidate's years of experience with job requirements:
  - If Resume Experience $\ge$ Required Experience: **Full 20 Points**
  - If Required Experience is 0: **Full 20 Points**
  - Otherwise pro-rated: $\left( \frac{\text{Resume Experience}}{\text{Required Experience}} \right) \times 20$
- **10% Education Relevance**: Evaluates degree level and subject alignment:
  - `high` relevance (matching major & degree level): **10 Points**
  - `medium` relevance (related major or equivalent background): **6 Points**
  - `low` relevance (distant major with transferable skills): **3 Points**
  - `none` relevance (completely unrelated or missing credentials): **0 Points**

**Total Score** is programmatically rounded and clamped strictly between **0 and 100**.

---

## 📂 Project Folder Structure

```
├── lib/
│   └── llm.ts                # AI service abstraction layer & Gemini Client
├── src/
│   ├── components/           # Reusable UI widgets
│   │   ├── AtsCompatibilityCard.tsx # ATS scoring dial, layout strengths, and gaps
│   │   ├── NarrativeSection.tsx   # Recruiter narrative, strengths, suggestions
│   │   ├── ResumeForm.tsx         # Drag-drop uploader, inputs, sample cases
│   │   ├── ScoreBreakdownCard.tsx # Detailed scorecard & metric progression lines
│   │   ├── ScoreGauge.tsx         # Animated circular SVG match score indicator
│   │   └── SkillsGrid.tsx         # Filterable skills tabs with priority-ranked gaps
│   ├── utils/
│   │   ├── pdf.ts            # Multipage PDF exporter using jsPDF
│   │   └── scoring.ts        # Programmatic scoring logic
│   ├── App.tsx               # Main application orchestration page
│   ├── index.css             # Tailwind stylesheet & custom Typography pairing
│   ├── main.tsx              # React mounting entry point
│   └── types.ts              # Global type contracts
├── package.json              # App scripts and core dependencies
├── server.ts                 # Backend Express controller & asset router
├── vite.config.ts            # Vite bundler options
└── tsconfig.json             # TypeScript rules configuration
```

---

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Environment Variable Setup
Clone `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your API credentials:
```env
GEMINI_API_KEY="AIzaSyYourActualGoogleAIStudioAPIKey"
```

### 2. Local Installation
Install dependencies:
```bash
npm install
```

### 3. Run Development Server
Boot the full-stack server locally (runs on port 3000):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to interact with the system.

---


## 🚀 Future Enhancements (Post-MVP Roadmap)

- **Vector Database Integration**: Store processed resumes in a vector database (e.g., Pinecone or pgvector) to enable semantic "fuzzy" candidate search across directories.
- **Batch Processing**: Allow recruiters to upload a zip folder of resumes and run comparisons against a single job description in parallel.
- **Interactive Cover Letter Generator**: Include an AI drafting assistant to generate highly optimized, matching cover letters based on identified core strengths.
