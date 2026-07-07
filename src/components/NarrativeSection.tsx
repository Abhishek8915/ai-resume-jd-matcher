/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, HelpCircle, Lightbulb, Compass, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface NarrativeSectionProps {
  narrative: {
    reasoning: string;
    strengths: string[];
    missing: string[];
    improvements: string[];
  };
  suggestions: string[];
}

export default function NarrativeSection({ narrative, suggestions }: NarrativeSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      const strengthsList = narrative.strengths.map(s => `• Strengths: ${s}`).join('\n');
      const improvementsList = suggestions.map(i => `• Suggestion: ${i}`).join('\n');
      const fullCopyText = `Recruiter Match Assessment:\n\nSummary:\n${narrative.reasoning}\n\nCandidate Strengths:\n${strengthsList}\n\nOptimization Suggestions:\n${improvementsList}`;
      
      await navigator.clipboard.writeText(fullCopyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Narrative Recruiter Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        {/* Decorative backdrop accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              Recruiter Narrative Summary
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deep semantic evaluation explaining the suitability factors.
            </p>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            title="Copy full evaluation to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Assessment</span>
              </>
            )}
          </button>
        </div>

        <div className="relative z-10 border-l-4 border-indigo-600 pl-4 mt-2">
          <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
            {narrative.reasoning}
          </p>
        </div>
      </div>

      {/* Strengths & Recommendations Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
              Candidate Profile Strengths
            </h3>
            {narrative.strengths.length > 0 ? (
              <ul className="space-y-3.5">
                {narrative.strengths.map((strength, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-2.5 items-start text-xs text-slate-600"
                  >
                    <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No significant strengths extracted.</p>
            )}
          </div>
        </div>

        {/* Actionable Suggestions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Optimization Suggestions
            </h3>
            {suggestions.length > 0 ? (
              <ul className="space-y-3.5">
                {suggestions.map((suggestion, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-2.5 items-start text-xs text-slate-600"
                  >
                    <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No suggested resume changes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
