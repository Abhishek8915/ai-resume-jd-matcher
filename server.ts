/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
// @ts-ignore
// const { PDFParse } = require('pdf-parse');
// console.log("PDF PARSER EXPORT:", pdf);
// console.log("========== PDF MODULE ==========");
// console.dir(pdf, { depth: null });
// console.log("===============================");

import { llmService } from './lib/llm';
import { calculateMatchScore } from './src/utils/scoring';
// import { ResumeMatchRequest } from './src/types';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  // const PORT = 3000;
  const PORT = Number(process.env.PORT) || 3000;

  // Increase payload limit to safely support base64 encoded PDF uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // API Route: Resume & Job Description Matcher Analyser
  app.post('/api/match', async (req, res) => {
    try {
      const { resumeText, resumePdfBase64, jdText } = req.body;

      if (!jdText || jdText.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Job description is required.' 
        });
      }

      let parsedResumeText = (resumeText || '').trim();

      // Handle PDF extraction if Base64 PDF is uploaded
      if (resumePdfBase64) {
        try {
          // Strip data URI scheme prefix if present (e.g., "data:application/pdf;base64,")
          const base64Clean = resumePdfBase64.replace(/^data:application\/pdf;base64,/, '');
          const pdfBuffer = Buffer.from(base64Clean, 'base64');
          
          if (pdfBuffer.length === 0) {
            throw new Error('PDF upload buffer is empty.');
          }

          // const parsedData = await pdf(pdfBuffer);
          const parser = new pdf.PDFParse({
            data: pdfBuffer,
          });
          const parsedData = await parser.getText();
          
          // Always clean up the parser
          await parser.destroy();

          if (parsedData?.text?.trim()) {
            parsedResumeText = parsedData.text.trim();
          } else {
            throw new Error("Extracted PDF text is empty.");
          }
        } catch (pdfError) {
          console.error('PDF parsing error on server:', pdfError);
          // If plain text was ALSO provided, we fall back to it. Otherwise, we inform the user.
          if (parsedResumeText.length === 0) {
            return res.status(422).json({
              error: `PDF Parsing Failed: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}. Please copy and paste your resume in plain text format instead.`
            });
          }
          console.log('Falling back to manually pasted resume text due to PDF parse failure.');
        }
      }

      if (parsedResumeText.length === 0) {
        return res.status(400).json({ 
          error: 'Please provide resume text or upload a valid resume PDF file.' 
        });
      }

      // 1. Send resume text and job description to the swappable LLM Service
      const analysis = await llmService.analyzeMatch(parsedResumeText, jdText);

      // 2. Programmatically compute deterministic matching score on the backend
      const result = calculateMatchScore(analysis);

      // Return the completed assessment payload
      return res.json(result);

    } catch (error) {
      console.error('API /api/match error:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred during analysis.' 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite static file / dev server middleware routing
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Serve client index.html for all single page app routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
