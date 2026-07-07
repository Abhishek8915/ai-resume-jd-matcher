/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, Briefcase, ChevronRight } from 'lucide-react';

interface ResumeFormProps {
  onAnalyze: (payload: { resumeText: string; resumePdfBase64: string | null; jdText: string; resumeFileName?: string }) => void;
  isLoading: boolean;
}

// Industry-standard realistic datasets for demo matching
const SAMPLE_CASES = {
  softwareEngineer: {
    title: "Software Engineer (Full Stack)",
    jd: `Position: Senior Full-Stack Software Engineer
Department: Engineering
Location: Remote (US)

Role Summary:
We are looking for a Senior Full-Stack Software Engineer with 5+ years of experience to lead the development of our high-volume B2B SaaS platform. You will build core backend systems, optimize client-side applications, and work closely with AI products.

Minimum Requirements & Required Skills:
- 5+ years of professional software engineering experience.
- Strong proficiency in modern Web Technologies: React, TypeScript, and TailwindCSS.
- Expert knowledge of backend services and databases (PostgreSQL, Node.js/Express).
- Experience building and integrating RESTful APIs and modern cloud providers.
- B.S. in Computer Science or equivalent field.

Preferred Skills & Experience:
- Experience with AI tooling and LLM APIs (e.g. Gemini, OpenAI SDKs).
- Familiarity with CI/CD deployment pipelines (GitHub Actions, Docker, AWS).
- Excellent communication skills and mentor mindset.`,
    resume: `ALEX RIVERA
Full-Stack Software Engineer | alex.rivera@email.com | (555) 019-2834 | San Francisco, CA

SUMMARY
Highly accomplished Full-Stack Software Engineer with 6 years of experience building scalable SaaS products, microservices, and client-side web architectures. Expert in TypeScript and React ecosystems with a passion for high-performance interfaces and system performance.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, SQL (PostgreSQL), Python, HTML5, CSS3
- Frontend: React 18, TailwindCSS, Next.js, Redux, Webpack
- Backend: Node.js, Express, RESTful APIs, GraphQL
- Cloud & Infrastructure: AWS (S3, EC2, RDS), Docker, GitHub Actions, Vercel

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudVantage Solutions (2022 - Present)
- Led a team of 4 engineers to design and execute a cloud-based analytics dashboard, boosting user engagement by 45%.
- Migrated legacy frontend modules to React 18 & TypeScript, reducing client-side load latency by 35%.
- Implemented robust Node.js/Express APIs backed by PostgreSQL, optimizing database query response times by 20%.
- Integrated OpenAI and Gemini LLM APIs to power smart report automated summaries, creating a new $12k MRR feature.

Software Engineer | DevStream Labs (2020 - 2022)
- Maintained core high-traffic client platforms, deploying modern features using React and TailwindCSS.
- Spearheaded CI/CD automation using GitHub Actions, decreasing release cycle delays by 15 hours per week.
- Built secondary database schemas and managed PostgreSQL replication pools on AWS RDS.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (Graduated 2020)`
  },
  dataScientist: {
    title: "Data Scientist (Partial Match)",
    jd: `Position: Senior Data Scientist / Machine Learning Engineer
Department: Core AI Research
Location: New York, NY

Role Summary:
Join our research team to design, train, and deploy advanced deep learning models. You will be building predictive analytics systems, training customized neural networks, and creating pipelines to process terabytes of unstructured data.

Minimum Requirements & Required Skills:
- 4+ years of professional Data Science or Machine Learning experience.
- Expert skill with Python, PyTorch, TensorFlow, and Pandas.
- Proven experience training deep learning models, natural language processing (NLP), or computer vision.
- Strong knowledge of SQL, distributed data frameworks (Spark, Hadoop), and BigQuery.
- Master's or Ph.D. in Data Science, Statistics, Mathematics, or Computer Science.

Preferred Skills:
- Experience deploying machine learning containers with Docker/Kubernetes.
- Academic publications at NeurIPS, ICML, or CVPR.`,
    resume: `PRIYA SHARMA
Data Analyst & Data Scientist | priya.sharma@email.com | (555) 987-6543 | Chicago, IL

SUMMARY
Enthusiastic Data Scientist and Analyst with 2 years of professional experience leveraging statistics, data cleansing, and predictive analytics to solve commercial challenges. Skilled in Python and data engineering packages. Seeking to transition into advanced Machine Learning research roles.

TECHNICAL SKILLS
- Languages: Python, R, SQL, MATLAB
- Machine Learning: Pandas, NumPy, Scikit-Learn, TensorFlow (Basic)
- Analytics & Viz: Tableau, Matplotlib, PowerBI, Excel
- Databases: MySQL, PostgreSQL, BigQuery

PROFESSIONAL EXPERIENCE
Data Analyst | RetailEdge Corp (2024 - Present)
- Developed customized Python scripts to automate monthly marketing report delivery, saving 12 manual hours weekly.
- Built interactive Tableau business intelligence dashboards monitored by executive leadership.
- Managed SQL database schemas to clean and store consumer loyalty metric tracking points.

Junior Data Scientist | InsightFlow (2022 - 2024)
- Assisted senior researchers in training standard regression and classification models using Scikit-Learn.
- Cleaned unstructured tabular data pipelines using Pandas and NumPy, preparing records for downstream neural networks.

EDUCATION
B.S. in Applied Mathematics | Northwestern University (Graduated 2022)`
  }
};

export default function ResumeForm({ onAnalyze, isLoading }: ResumeFormProps) {
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  
  // PDF upload states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported for resume uploading.');
      return;
    }
    setPdfFile(file);
    
    // Convert PDF file to base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPdfBase64(base64);
    };
    reader.onerror = () => {
      alert('Failed to read PDF file binary data.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadDemo = (caseKey: 'softwareEngineer' | 'dataScientist') => {
    const selected = SAMPLE_CASES[caseKey];
    setJdText(selected.jd);
    setResumeText(selected.resume);
    removePdf(); // Clear any loaded PDF so text matches the demo
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      alert('Please provide a job description.');
      return;
    }
    if (!resumeText.trim() && !pdfBase64) {
      alert('Please paste your resume text or upload a resume PDF.');
      return;
    }

    onAnalyze({
      resumeText,
      resumePdfBase64: pdfBase64,
      jdText,
      resumeFileName: pdfFile?.name
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Loader Section */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Need sample documents? Load a demo assessment scenario:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadDemo('softwareEngineer')}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Software Engineer (Strong Match)</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemo('dataScientist')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Data Scientist (Partial Match)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Hand: Resume Upload and Raw Text Inputs */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h3 className="text-md font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-500" />
              1. Candidate Resume
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide the resume in either PDF or paste raw text below.
            </p>
          </div>

          {/* Drag & Drop PDF upload */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer ${
              dragActive ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            {pdfFile ? (
              <div className="flex items-center justify-between w-full bg-white border border-slate-100 rounded-lg p-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 text-xs">
                  <Upload className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate max-w-[180px] sm:max-w-[300px]">
                    {pdfFile.name}
                  </span>
                  <span className="text-slate-400">
                    ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-1.5 pointer-events-none">
                <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Drag & drop resume PDF here, or <span className="text-indigo-600 hover:underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Supported formats: PDF (max 10MB)
                </p>
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Or paste text format
            </span>
            <div className="w-full border-t border-slate-100" />
          </div>

          {/* Raw Text pasting */}
          <div>
            <textarea
              id="resume-text-input"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume plain text here..."
              className="w-full h-56 p-4 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-sans leading-relaxed"
              disabled={!!pdfFile}
            />
            {pdfFile && (
              <p className="text-[10px] text-emerald-600 font-medium mt-1">
                ✓ PDF upload will override plain text input during processing. Remove PDF to edit text.
              </p>
            )}
          </div>
        </div>

        {/* Right Hand: Job Description Raw Text Input */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="w-full space-y-5">
            <div>
              <h3 className="text-md font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
                2. Job Description
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste the target job specification details.
              </p>
            </div>

            <div>
              <textarea
                id="jd-text-input"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste Job Description specifications here..."
                className="w-full h-80 p-4 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-sans leading-relaxed"
                required
              />
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <button
              type="submit"
              disabled={isLoading || (!jdText.trim() || (!resumeText.trim() && !pdfBase64))}
              className={`w-full py-3 px-4 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                isLoading || (!jdText.trim() || (!resumeText.trim() && !pdfBase64))
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-100 shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Match Context...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Compare Resume & Job Description</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
