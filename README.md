# AI Resume–Job Description Matcher

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](<https://ai-resume-jd-matcher-production.up.railway.app/>)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](<https://github.com/Abhishek8915/ai-resume-jd-matcher>)

A full-stack web application that compares a candidate's resume with a job description using Google Gemini AI and a deterministic backend scoring algorithm.

Developed as part of the AI Intern Practical Assessment for E2M Solutions.

---

## Overview

The application accepts a resume (PDF or plain text) and a job description, extracts structured information using Google Gemini, and computes a deterministic match score based on predefined weighted criteria.

The generated analysis includes:

- Match Score (0–100)
- Matched Skills
- Missing Skills
- Priority Missing Skills
- ATS Compatibility Analysis
- Experience & Education Alignment
- Recruiter-style Summary
- Resume Improvement Suggestions

---

## Live Demo

**Application**

<https://ai-resume-jd-matcher-production.up.railway.app/>

**GitHub Repository**

<https://github.com/Abhishek8915/ai-resume-jd-matcher>

---

## Features

- Resume upload (PDF) with backend text extraction
- Plain text resume support
- Job description text input
- AI-powered skill extraction using Google Gemini
- Deterministic weighted scoring algorithm
- ATS compatibility analysis
- Matched and missing skills visualization
- Priority-ranked missing skills
- Recruiter-style narrative explanation
- Resume improvement suggestions
- Professional PDF report export
- Sample demo cases for quick evaluation

---

# System Architecture

```
                        React + Vite Frontend
                                 │
                                 │
                                 ▼
                        Express Backend API
                                 │
          ┌──────────────────────┴──────────────────────┐
          │                                             │
          ▼                                             ▼
   PDF Text Extraction                           Gemini AI Service
      (pdf-parse)                              (Google GenAI SDK)
          │                                             │
          └──────────────────────┬──────────────────────┘
                                 ▼
                     Structured Resume Analysis
                                 │
                                 ▼
               Deterministic Backend Scoring Engine
                                 │
                                 ▼
                     Visualization & PDF Export
```

---

# Technology Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Motion
- Lucide React

## Backend

- Node.js
- Express

## AI

- Google Gemini API
- Google GenAI SDK

## Utilities

- pdf-parse
- jsPDF

---

# Project Structure

```
.
├── lib/
│   └── llm.ts
├── src/
│   ├── components/
│   ├── utils/
│   │   ├── pdf.ts
│   │   └── scoring.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── server.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

# Scoring Methodology

The application separates AI extraction from score calculation.

Google Gemini is responsible for extracting structured information from the resume and job description.

The final suitability score is computed programmatically on the backend using a deterministic weighted formula.

| Component | Weight |
|-----------|--------|
| Required Skill Match | 40% |
| Semantic Similarity | 30% |
| Experience Match | 20% |
| Education Relevance | 10% |

The final score is clamped between **0 and 100**.

This approach provides consistent scoring while leveraging the LLM for semantic understanding.

---

# Setup

## Prerequisites

- Node.js 18+
- Google Gemini API Key

---

## Installation

```bash
git clone <YOUR_GITHUB_REPO_URL>

cd ai-resume-jd-matcher

npm install
```

---

## Environment Variables

Create a `.env` file.

```
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Run Development Server

```bash
npm run dev
```

Application:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build

npm start
```

---

# Design Decisions

The project follows a modular architecture where the AI interaction is isolated behind a dedicated service layer (`lib/llm.ts`). This allows the underlying LLM provider to be replaced with minimal changes to the application.

Instead of allowing the LLM to directly generate a match score, the application uses the LLM only for structured information extraction. The final score is computed programmatically using a deterministic weighted algorithm, ensuring consistent and explainable results.

Resume parsing is handled on the backend, enabling support for both uploaded PDF resumes and manually entered text while keeping the frontend lightweight.

---

# Future Improvements

- Batch resume evaluation
- Vector database integration for semantic candidate search
- Cover letter generation
- Resume history and comparison
- Authentication and recruiter dashboard

---

# Notes

- The deployed application is connected to the GitHub repository and supports automatic redeployment after new commits.
- The application has been validated using both manually entered resume text and uploaded PDF resumes.
- For local execution, configure a valid Gemini API key before running the application.