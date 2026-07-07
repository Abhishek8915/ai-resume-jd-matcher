/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LLMAnalysisResult, ResumeMatchResponse, ScoreBreakdown } from '../types';

/**
 * Deterministic Weighted Scoring Algorithm for Resume - Job Description Matcher
 * 
 * Score Components:
 * 1. Required Skills Overlap (40% Weight):
 *    - Meant to reflect how many of the required skills in the Job Description are found in the Resume.
 *    - Formula: (matchedSkills.length / jdRequiredSkills.length) * 40
 *    - If the JD has no required skills, defaults to full 40 points.
 * 
 * 2. Semantic Similarity (30% Weight):
 *    - Evaluates the overall contextual, domain-specific alignment between the candidate's background and the job.
 *    - Formula: semanticSimilarity * 30 (where similarity is a decimal 0.0 to 1.0 determined by the LLM).
 * 
 * 3. Experience Match (20% Weight):
 *    - Assesses whether the candidate meets or exceeds the required years of experience.
 *    - Formula:
 *      - If experienceYearsResume >= experienceYearsRequired: Full 20 points
 *      - If experienceYearsRequired is 0: Full 20 points
 *      - Else: (experienceYearsResume / experienceYearsRequired) * 20 points
 * 
 * 4. Education Relevance (10% Weight):
 *    - Maps the qualification level of the resume to the job description requirements.
 *    - Formula:
 *      - 'high' relevance (e.g., matching degree, field, or exceed): 10 points
 *      - 'medium' relevance (e.g., related field or lower degree with strong profile): 6 points
 *      - 'low' relevance (e.g., distant field but some background): 3 points
 *      - 'none' relevance (e.g., completely unrelated or missing background): 0 points
 * 
 * Total Score = Sum(Skills, Semantic, Experience, Education)
 * The total is clamped securely between 0 and 100.
 */
export function calculateMatchScore(analysis: LLMAnalysisResult): ResumeMatchResponse {
  // 1. Required Skills Overlap (40%)
  const requiredCount = analysis.jdRequiredSkills.length;
  const matchedCount = analysis.matchedSkills.length;
  let skillsScore = 40;
  let skillsDetails = 'No required skills were specified in the job description.';

  if (requiredCount > 0) {
    const rawSkillsScore = (matchedCount / requiredCount) * 40;
    skillsScore = Math.min(40, Math.max(0, parseFloat(rawSkillsScore.toFixed(1))));
    skillsDetails = `Matched ${matchedCount} out of ${requiredCount} required skills (${Math.round((matchedCount / requiredCount) * 100)}%).`;
  }

  // 2. Semantic Similarity (30%)
  const semanticValue = Math.min(1, Math.max(0, analysis.semanticSimilarity));
  const semanticScore = parseFloat((semanticValue * 30).toFixed(1));
  const semanticDetails = `Overall profile semantic context alignment score is ${Math.round(semanticValue * 100)}%.`;

  // 3. Experience Match (20%)
  const expResume = analysis.experienceYearsResume;
  const expRequired = analysis.experienceYearsRequired;
  let experienceScore = 20;
  let experienceDetails = 'No minimum experience requirement was specified.';

  if (expRequired > 0) {
    if (expResume >= expRequired) {
      experienceScore = 20;
      experienceDetails = `Meets or exceeds requirements. Profile has ${expResume} years of experience vs ${expRequired} years required.`;
    } else {
      const rawExpScore = (expResume / expRequired) * 20;
      experienceScore = Math.min(20, Math.max(0, parseFloat(rawExpScore.toFixed(1))));
      experienceDetails = `Candidate has ${expResume} years of experience vs ${expRequired} years required (pro-rated match).`;
    }
  } else {
    experienceDetails = `Profile has ${expResume} years of experience; no specific target was requested.`;
  }

  // 4. Education Relevance (10%)
  let educationScore = 0;
  let educationDetails = '';

  switch (analysis.educationRelevance) {
    case 'high':
      educationScore = 10;
      educationDetails = `Education background (${analysis.education}) matches or exceeds JD requirements.`;
      break;
    case 'medium':
      educationScore = 6;
      educationDetails = `Education background (${analysis.education}) is moderately aligned or in a closely related field.`;
      break;
    case 'low':
      educationScore = 3;
      educationDetails = `Education background (${analysis.education}) has limited direct relevance to the job.`;
      break;
    case 'none':
    default:
      educationScore = 0;
      educationDetails = `Education background (${analysis.education || 'Not specified'}) is unrelated or does not meet the specified minimum requirements.`;
      break;
  }

  // Compute final combined score and round it
  const totalScoreRaw = skillsScore + semanticScore + experienceScore + educationScore;
  const score = Math.min(100, Math.max(0, Math.round(totalScoreRaw)));

  const breakdown: ScoreBreakdown = {
    skills: {
      score: skillsScore,
      max: 40,
      details: skillsDetails
    },
    semantic: {
      score: semanticScore,
      max: 30,
      details: semanticDetails
    },
    experience: {
      score: experienceScore,
      max: 20,
      details: experienceDetails
    },
    education: {
      score: educationScore,
      max: 10,
      details: educationDetails
    }
  };

  return {
    score,
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    priorityMissingSkills: analysis.priorityMissingSkills || [],
    atsCompatibility: analysis.atsCompatibility || {
      score: 70,
      strengths: ['Clear contact information', 'Logical layout structure'],
      issues: ['No quantitative impact metrics', 'Complex visual elements might confuse basic parser'],
      formattingScore: 80,
      summary: 'The resume uses clean structuring but lacks quantitative metrics.'
    },
    breakdown,
    narrative: {
      reasoning: analysis.narrativeReasoning,
      strengths: analysis.strengths,
      missing: analysis.missingSkills,
      improvements: analysis.suggestions
    },
    suggestions: analysis.suggestions,
    rawAnalysis: analysis
  };
}
