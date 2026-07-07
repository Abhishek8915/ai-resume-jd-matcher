/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Brain, Briefcase, GraduationCap, HelpCircle } from 'lucide-react';
import { ScoreBreakdown } from '../types';

interface ScoreBreakdownCardProps {
  breakdown: ScoreBreakdown;
}

export default function ScoreBreakdownCard({ breakdown }: ScoreBreakdownCardProps) {
  const metrics = [
    {
      key: 'skills',
      name: 'Required Skills Overlap',
      icon: Cpu,
      weight: '40%',
      data: breakdown.skills,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
    },
    {
      key: 'semantic',
      name: 'Semantic Profile Match',
      icon: Brain,
      weight: '30%',
      data: breakdown.semantic,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'experience',
      name: 'Experience Alignment',
      icon: Briefcase,
      weight: '20%',
      data: breakdown.experience,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
    },
    {
      key: 'education',
      name: 'Education Relevance',
      icon: GraduationCap,
      weight: '10%',
      data: breakdown.education,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          Scorecard Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Weighted programmatic assessment based on job description metrics.
        </p>
      </div>

      <div className="space-y-5 flex-grow">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const { score, max, details } = metric.data;
          const percentage = (score / max) * 100;

          return (
            <div key={metric.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <div className={`p-1 rounded-md ${metric.bgColor} ${metric.textColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{metric.name}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    (Weight: {metric.weight})
                  </span>
                </div>
                <div className="font-bold text-slate-800">
                  {score} <span className="text-slate-400 font-normal">/ {max}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${metric.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
                />
              </div>

              {/* Specific details */}
              <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
                {details}
              </p>
            </div>
          );
        })}
      </div>

      {/* Formula explanation */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50 p-3 rounded-lg flex gap-2">
        <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
        <div>
          <span className="font-semibold text-slate-600 block mb-0.5">Scoring Formula</span>
          Match Score (100) = Skills (40) + Semantic (30) + Experience (20) + Education (10). Clamped between 0 and 100.
        </div>
      </div>
    </div>
  );
}
