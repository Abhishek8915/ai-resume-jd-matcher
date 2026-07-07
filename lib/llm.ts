/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { LLMAnalysisResult } from '../src/types';

// Initialize the Google Gen AI client safely.
// In the production environment, GEMINI_API_KEY is injected automatically.
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Interface representing the generic LLM matcher service.
 * This satisfies the user's architectural request to hide LLM logic behind
 * a swap-ready abstraction.
 */
export interface ILLMService {
  analyzeMatch(resumeText: string, jdText: string): Promise<LLMAnalysisResult>;
}

export class GeminiLLMService implements ILLMService {
  async analyzeMatch(resumeText: string, jdText: string): Promise<LLMAnalysisResult> {
    const ai = getGeminiClient();
 
    const systemInstruction = `You are a staff talent acquisition specialist and professional technical recruiter. 
Your task is to analyze a candidate's resume and a job description (JD) to extract precise structured profiles, evaluate educational alignment, and perform deep semantic matching.

Follow these strict matching rules:
- Extract all professional skills from both documents.
- Compare skills using case-insensitive semantic matching.
- Identify "matchedSkills" as skills that are mentioned in the resume and correspond directly to the JD.
- Identify "missingSkills" as required skills in the JD that are not present in the resume.
- Prioritize and rank the missing skills (as PrioritySkill objects with priority high, medium, or low) based on their criticality to the role described.
- Assess ATS Compatibility (score 0-100, formattingScore 0-100, lists of parsing strengths and potential issue/blocker areas) to check if the resume is parseable and keyword-optimized.
- Parse years of professional experience from both documents. Ignore academic years unless they are professional internships.
- Rate the highest degree of education. Determine "educationRelevance" based on alignment with the job ('high' = matching degree/field, 'medium' = related field/equivalent, 'low' = distant field but transferable, 'none' = unrelated/unmet).
- Determine a candidate's profile "semanticSimilarity" (between 0.0 and 1.0) based on role alignment, industry experience, and overall background.
- Provide highly descriptive, constructive reasoning, 3-5 distinct strengths, and 3-5 specific, actionable suggestions for resume optimization.`;
 
    const prompt = `Please analyze the following Resume and Job Description:
 
=== RESUME TEXT ===
${resumeText}
 
=== JOB DESCRIPTION ===
${jdText}
 
=== END OF INPUTS ===
Provide your assessment strictly conforming to the JSON schema output requirement.`;
 
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resumeSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key skills parsed from the resume.'
              },
              jdRequiredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Required skills listed in the job description.'
              },
              jdPreferredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Preferred or optional skills listed in the job description.'
              },
              matchedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Required skills from the JD that are present in the candidate resume.'
              },
              missingSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Required skills from the JD that are missing or not clear in the candidate resume.'
              },
              priorityMissingSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: 'Name of the missing skill.' },
                    priority: { type: Type.STRING, description: 'Must be "high", "medium", or "low" based on importance to the JD.' },
                    description: { type: Type.STRING, description: 'Brief rationale explaining the priority.' }
                  },
                  required: ['name', 'priority', 'description']
                },
                description: 'Critical missing skills from the JD mapped to impact levels.'
              },
              atsCompatibility: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER, description: 'Estimated ATS keyword match and parser index score (0-100).' },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'ATS parsing strengths of this resume.' },
                  issues: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'ATS layout, format, or keyword issues.' },
                  formattingScore: { type: Type.INTEGER, description: 'Formatting compliance index (0-100).' },
                  summary: { type: Type.STRING, description: 'One-sentence summary overview of ATS health.' }
                },
                required: ['score', 'strengths', 'issues', 'formattingScore', 'summary']
              },
              experienceYearsResume: {
                type: Type.NUMBER,
                description: 'Estimated total years of professional experience in the resume.'
              },
              experienceYearsRequired: {
                type: Type.NUMBER,
                description: 'Minimum required years of experience listed in the JD.'
              },
              education: {
                type: Type.STRING,
                description: 'Candidate highest degree level and major (e.g. B.S. in Computer Science).'
              },
              educationRelevance: {
                type: Type.STRING,
                description: 'Relevance rating of the candidate\'s education to the JD. Must be exactly: "high", "medium", "low", "none".'
              },
              summary: {
                type: Type.STRING,
                description: 'A 2-sentence professional executive summary of the candidate\'s suitability.'
              },
              semanticSimilarity: {
                type: Type.NUMBER,
                description: 'Contextual similarity score between candidate profile and JD, between 0.0 (unrelated) and 1.0 (perfect fit).'
              },
              narrativeReasoning: {
                type: Type.STRING,
                description: 'Recruiter feedback explaining the matching results, high/low score factors, and overall assessment.'
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 3 to 5 candidate key strengths matching the job requirements.'
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of 3 to 5 specific suggestions to improve the candidate\'s resume for this role.'
              }
            },
            required: [
              'resumeSkills',
              'jdRequiredSkills',
              'jdPreferredSkills',
              'matchedSkills',
              'missingSkills',
              'priorityMissingSkills',
              'atsCompatibility',
              'experienceYearsResume',
              'experienceYearsRequired',
              'education',
              'educationRelevance',
              'summary',
              'semanticSimilarity',
              'narrativeReasoning',
              'strengths',
              'suggestions'
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty response text from Gemini API.');
      }

      const parsed: LLMAnalysisResult = JSON.parse(responseText.trim());
      return parsed;

    } catch (error) {
      console.error('LLM Analysis Error:', error);
      throw new Error(`Failed to analyze resume match: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Swappable instance
export const llmService: ILLMService = new GeminiLLMService();
