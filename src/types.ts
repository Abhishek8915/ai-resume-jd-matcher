/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PrioritySkill {
  name: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface AtsCompatibility {
  score: number;
  strengths: string[];
  issues: string[];
  formattingScore: number;
  summary: string;
}

// Schema returned from the LLM after parsing and comparing resume + job description
export interface LLMAnalysisResult {
  resumeSkills: string[];
  jdRequiredSkills: string[];
  jdPreferredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  priorityMissingSkills: PrioritySkill[]; // Priority-ranked missing skills
  atsCompatibility: AtsCompatibility;     // ATS compatibility check
  experienceYearsResume: number;
  experienceYearsRequired: number;
  education: string;
  educationRelevance: 'high' | 'medium' | 'low' | 'none';
  summary: string;
  semanticSimilarity: number; // 0.0 to 1.0
  narrativeReasoning: string;  // Detailed overview of why the match is high/low
  strengths: string[];         // Key strengths of the candidate matching the JD
  suggestions: string[];       // Suggestions for improving the resume to match the JD
}

// Programmatic scoring breakdown details
export interface ScoringComponent {
  score: number;
  max: number;
  details: string;
}

export interface ScoreBreakdown {
  skills: ScoringComponent;
  semantic: ScoringComponent;
  experience: ScoringComponent;
  education: ScoringComponent;
}

// Final output payload returned by the backend API to the frontend
export interface ResumeMatchResponse {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  priorityMissingSkills: PrioritySkill[];
  atsCompatibility: AtsCompatibility;
  breakdown: ScoreBreakdown;
  narrative: {
    reasoning: string;
    strengths: string[];
    missing: string[];
    improvements: string[];
  };
  suggestions: string[];
  rawAnalysis?: LLMAnalysisResult;
}

// API request body structure
export interface ResumeMatchRequest {
  resumeText: string;
  jdText: string;
  resumeFileName?: string;
}
