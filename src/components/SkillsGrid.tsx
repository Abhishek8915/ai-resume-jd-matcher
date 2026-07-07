/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, AlertOctagon, Info } from 'lucide-react';
import { PrioritySkill } from '../types';

interface SkillsGridProps {
  matchedSkills: string[];
  missingSkills: string[];
  priorityMissingSkills?: PrioritySkill[];
}

export default function SkillsGrid({ matchedSkills, missingSkills, priorityMissingSkills = [] }: SkillsGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'missing' | 'priority'>('all');

  const totalRequired = matchedSkills.length + missingSkills.length;
  const matchRate = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 100;

  // Group priority missing skills if available
  const highPriority = priorityMissingSkills.filter(s => s.priority.toLowerCase() === 'high');
  const mediumPriority = priorityMissingSkills.filter(s => s.priority.toLowerCase() === 'medium');
  const lowPriority = priorityMissingSkills.filter(s => s.priority.toLowerCase() === 'low');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="skills-grid">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Skill Coverage Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Required skills identified from the Job Description and evaluated in your Resume.
          </p>
        </div>

        {/* Micro-insights pill */}
        {totalRequired > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-xs shrink-0 self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-600">
              Required Skill Match Rate: <strong className="text-indigo-600">{matchRate}%</strong>
            </span>
          </div>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-100 mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          All Required ({totalRequired})
        </button>
        <button
          onClick={() => setActiveTab('matched')}
          className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === 'matched'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Matched ({matchedSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer ${
            activeTab === 'missing'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Missing ({missingSkills.length})
        </button>
        {priorityMissingSkills.length > 0 && (
          <button
            onClick={() => setActiveTab('priority')}
            className={`pb-3 text-xs font-semibold px-2 transition-all border-b-2 -mb-[1px] whitespace-nowrap cursor-pointer ${
              activeTab === 'priority'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Priority Ranked Gaps ({priorityMissingSkills.length})
          </button>
        )}
      </div>

      {/* Skills Grid Render */}
      <div className="space-y-6">
        {/* Matched Skills Subgrid */}
        {(activeTab === 'all' || activeTab === 'matched') && (
          <div>
            {activeTab === 'all' && matchedSkills.length > 0 && (
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Matched Skills
              </h4>
            )}
            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium transition-all hover:bg-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              activeTab === 'matched' && (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                  No matched skills found. Resume might need optimization for required keywords.
                </div>
              )
            )}
          </div>
        )}

        {/* Separator line when All is active and both have elements */}
        {activeTab === 'all' && matchedSkills.length > 0 && missingSkills.length > 0 && (
          <div className="border-t border-slate-100 my-4" />
        )}

        {/* Missing Skills Subgrid */}
        {(activeTab === 'all' || activeTab === 'missing') && (
          <div>
            {activeTab === 'all' && missingSkills.length > 0 && (
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Missing Required Skills
              </h4>
            )}
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-medium transition-all hover:bg-amber-100"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              activeTab === 'missing' && (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                  Amazing! No missing required skills were found. You meet all core skill keywords.
                </div>
              )
            )}
          </div>
        )}

        {/* Priority Ranked Gaps Tab View */}
        {(activeTab === 'priority' || (activeTab === 'all' && priorityMissingSkills.length > 0)) && (
          <div className="pt-2">
            {(activeTab === 'all') && (
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                Priority Ranked Gaps
              </h4>
            )}
            {priorityMissingSkills.length > 0 ? (
              <div className="space-y-3">
                {priorityMissingSkills.map((item, idx) => {
                  const priority = item.priority.toLowerCase();
                  let badgeStyle = 'bg-rose-50 text-rose-700 border-rose-100';
                  if (priority === 'medium') {
                    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-100';
                  } else if (priority === 'low') {
                    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';
                  }

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${badgeStyle} uppercase tracking-wider`}>
                          {item.priority}
                        </span>
                        <div>
                          <strong className="text-xs font-semibold text-slate-800 block sm:inline">{item.name}</strong>
                          <p className="text-xs text-slate-500 mt-0.5 sm:mt-0 sm:ml-2 sm:inline">— {item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No prioritized skill gaps analyzed.</p>
            )}
          </div>
        )}

        {/* Absolute empty state */}
        {totalRequired === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-100 rounded-xl">
            No required skills could be extracted. Please paste clear detailed inputs.
          </div>
        )}
      </div>
    </div>
  );
}
