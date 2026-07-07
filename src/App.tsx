/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Brain, 
  Cpu, 
  Terminal, 
  ChevronRight, 
  GraduationCap, 
  Layers,
  CheckCircle2,
  RefreshCw,
  Download
} from 'lucide-react';

import ResumeForm from './components/ResumeForm';
import ScoreGauge from './components/ScoreGauge';
import ScoreBreakdownCard from './components/ScoreBreakdownCard';
import SkillsGrid from './components/SkillsGrid';
import NarrativeSection from './components/NarrativeSection';
import AtsCompatibilityCard from './components/AtsCompatibilityCard';
import { generatePdfReport } from './utils/pdf';
import { ResumeMatchResponse } from './types';

// Multi-stage status messages to keep users engaged during analysis
const LOADING_STEPS = [
  'Reading resume and job description inputs...',
  'Extracting document keywords and experience parameters...',
  'Analyzing skills with Gemini AI models...',
  'Evaluating semantic profile match and context...',
  'Calculating deterministic scoring breakdown on the server...',
  'Formulating recruiter narrative and constructive advice...'
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ResumeMatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedFileName, setAnalyzedFileName] = useState<string | null>(null);

  // Dynamic loading step rotator to simulate deep pipeline processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (payload: {
    resumeText: string;
    resumePdfBase64: string | null;
    jdText: string;
    resumeFileName?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setAnalyzedFileName(payload.resumeFileName || null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: payload.resumeText,
          resumePdfBase64: payload.resumePdfBase64,
          jdText: payload.jdText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an invalid analysis response.');
      }

      setResult(data);
    } catch (err) {
      console.error('Match error on frontend:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAnalyzedFileName(null);
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    try {
      const doc = generatePdfReport(result, analyzedFileName);
      doc.save(`MatchWise_Report_${result.score}_Score.pdf`);
    } catch (err) {
      console.error('Failed to generate or save PDF report:', err);
      alert('An error occurred while generating the PDF report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between" id="app-root">
      {/* SaaS Styled Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-slate-950 tracking-tight flex items-center gap-1.5">
                AI Resume Matcher
                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {/* MVP */}
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                {/* AI Internship Assessment Portal */}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {result && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            )}
            <div className="text-slate-400 font-mono text-[10px] hidden md:block">
              Server State: <span className="text-emerald-500 font-bold">● Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence mode="wait">
          
          {/* 1. Loading State */}
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] max-w-xl mx-auto text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6"
            >
              {/* Spinner animation */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <Brain className="w-6 h-6 text-indigo-600 absolute animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Analyzing Competency Fit
                </h3>
                {/* Dynamically rotating step message */}
                <div className="h-8 overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStep}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-slate-500 font-semibold italic text-center w-full absolute"
                    >
                      {LOADING_STEPS[loadingStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Loader progress ticks */}
              <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* 2. Error Display */}
          {error && !isLoading && (
            <motion.div
              key="error-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-100 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800">Assessment Analysis Failed</h4>
                  <p className="text-xs text-red-600 mt-1 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Retry Configuration
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. Input Form View */}
          {!isLoading && !result && !error && (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Evaluate Profile-Job Alignment
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Upload a PDF resume or paste raw text alongside a job specification to extract target competencies, evaluate years of experience, and compute deterministic suitability metrics.
                </p>
              </div>

              <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          )}

          {/* 4. Results Dashboard View */}
          {!isLoading && result && !error && (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Back CTA block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Return to input inputs"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">
                      Analysis Results
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {analyzedFileName ? `Source PDF: ${analyzedFileName}` : 'Source: Plain text resume paste'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 hover:shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Report</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Analyze Another Profile</span>
                  </button>
                </div>
              </div>

              {/* Main Score & Breakdown Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score gauge container */}
                <div className="md:col-span-1">
                  <ScoreGauge score={result.score} />
                </div>
                {/* Scorecard table container */}
                <div className="md:col-span-2">
                  <ScoreBreakdownCard breakdown={result.breakdown} />
                </div>
              </div>

              {/* Skills intersection dashboard tag list */}
              <SkillsGrid 
                matchedSkills={result.matchedSkills} 
                missingSkills={result.missingSkills} 
                priorityMissingSkills={result.priorityMissingSkills}
              />

              {/* ATS compatibility audit section */}
              <AtsCompatibilityCard ats={result.atsCompatibility} />

              {/* Full verbal narrative section */}
              <NarrativeSection 
                narrative={result.narrative} 
                suggestions={result.suggestions} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Corporate Styled Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 text-center text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">AI Resume-JD Matcher</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              v1.0.0 Stable
            </span>
          </div>
          <p className="text-[11px] font-medium">
            {/* AI Practical Internship Assessment Platform • Evaluated using Gemini Pro & Flash */}
          </p>
          <p className="text-[10px] font-mono">
            Time: {new Date().getFullYear()} • Local Server Status OK
          </p>
        </div>
      </footer>
    </div>
  );
}
