/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AtsCompatibility } from '../types';

interface AtsCompatibilityCardProps {
  ats: AtsCompatibility;
}

export default function AtsCompatibilityCard({ ats }: AtsCompatibilityCardProps) {
  // Determine color theme based on score
  const score = ats?.score || 70;
  let scoreColor = 'text-emerald-500';
  let scoreBg = 'bg-emerald-50 border-emerald-100';
  let strokeColor = '#10b981'; // Emerald

  if (score < 50) {
    scoreColor = 'text-rose-500';
    scoreBg = 'bg-rose-50 border-rose-100';
    strokeColor = '#ef4444'; // Rose
  } else if (score < 80) {
    scoreColor = 'text-amber-500';
    scoreBg = 'bg-amber-50 border-amber-100';
    strokeColor = '#f59e0b'; // Amber
  }

  // Calculate SVG dash array
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const strengths = ats?.strengths || [];
  const issues = ats?.issues || [];
  const formattingScore = ats?.formattingScore || 75;
  const summary = ats?.summary || 'No detailed analysis returned.';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="ats-compatibility-card">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-5">
        <ShieldCheck className="w-5 h-5 text-indigo-500" />
        <div>
          <h3 className="text-md font-bold text-slate-900 tracking-tight">ATS Compatibility Audit</h3>
          <p className="text-xs text-slate-400">Verifies system indexability and layout parsing robustness.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Dial */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-50 pb-6 md:pb-0 md:pr-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-100 fill-none"
                strokeWidth="6"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                className="fill-none transition-all duration-1000 ease-out"
                stroke={strokeColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 leading-none">{score}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-1">ATS Index</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scoreBg} ${scoreColor}`}>
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Formatting: {formattingScore}%</span>
            </div>
          </div>
        </div>

        {/* ATS Strengths */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Parsing Strengths
          </h4>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No explicit strengths analyzed.</p>
          )}
        </div>

        {/* ATS Issues / Optimization */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Optimization Gaps
          </h4>
          {issues.length > 0 ? (
            <ul className="space-y-2">
              {issues.map((issue, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">Formatting is fully optimized for ATS.</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 text-[11px] text-slate-400 italic">
        <strong>ATS Compliance Summary:</strong> {summary}
      </div>
    </div>
  );
}
