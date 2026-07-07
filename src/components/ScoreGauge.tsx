/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  // SVG parameters for radial progress circle
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  
  // Animate the strokeDashoffset from full circumference (0% progress) to computed percentage
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on score levels
  let colorClass = 'stroke-emerald-500';
  let textClass = 'text-emerald-500';
  let bgClass = 'bg-emerald-50 dark:bg-emerald-950/20';
  let badgeLabel = 'Excellent Match';

  if (score < 40) {
    colorClass = 'stroke-red-500';
    textClass = 'text-red-500';
    bgClass = 'bg-red-50 dark:bg-red-950/20';
    badgeLabel = 'Needs Improvement';
  } else if (score < 70) {
    colorClass = 'stroke-amber-500';
    textClass = 'text-amber-500';
    bgClass = 'bg-amber-50 dark:bg-amber-950/20';
    badgeLabel = 'Partial Match';
  } else if (score < 85) {
    colorClass = 'stroke-teal-500';
    textClass = 'text-teal-500';
    bgClass = 'bg-teal-50 dark:bg-teal-950/20';
    badgeLabel = 'Strong Match';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer Circular Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Gauge Ring */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            className={colorClass}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text displaying Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-4xl font-extrabold tracking-tight ${textClass}`}
          >
            {score}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Match Score
          </span>
        </div>
      </div>

      {/* Suitability Badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-4 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide ${bgClass} ${textClass}`}
      >
        {badgeLabel}
      </motion.div>
    </div>
  );
}
