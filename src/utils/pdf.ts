/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { ResumeMatchResponse } from '../types';

/**
 * Generates a professionally formatted, highly clean, minimal PDF report of the Match Analysis
 * using the jsPDF library. Supports multi-page flow and strict page-height checking.
 */
export function generatePdfReport(result: ResumeMatchResponse, originalFileName?: string | null): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  // Helper to check and handle page overflows
  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > 265) {
      doc.addPage();
      y = margin + 10;
      return true;
    }
    return false;
  };

  // Helper to draw a horizontal rule
  const drawLine = (yPos: number) => {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };

  // 1. Header Section
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Primary Indigo (#4f46e5)
  doc.text('MatchWise AI', margin, y);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('RESUME - JOB DESCRIPTION SUITABILITY REPORT', margin + 65, y - 1);

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate-400
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${dateStr}   |   Source: ${originalFileName || 'Plain Text Input'}`, margin, y);

  y += 6;
  drawLine(y);

  // 2. Score Badge & Title
  y += 12;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('Profile Fit Summary', margin, y);

  // Score circular or box visual
  const scoreBoxWidth = 40;
  const scoreBoxHeight = 22;
  const scoreBoxX = pageWidth - margin - scoreBoxWidth;
  const scoreBoxY = y - 6;

  // Background box for score
  let badgeColor = [16, 185, 129]; // Emerald
  let badgeLabel = 'Excellent Match';
  if (result.score < 40) {
    badgeColor = [239, 68, 68]; // Red
    badgeLabel = 'Needs Improvement';
  } else if (result.score < 70) {
    badgeColor = [245, 158, 11]; // Amber
    badgeLabel = 'Partial Match';
  } else if (result.score < 85) {
    badgeColor = [20, 184, 166]; // Teal
    badgeLabel = 'Strong Match';
  }

  doc.setFillColor(248, 250, 252); // soft slate bg
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, 2, 2, 'FD');

  // Draw Score number inside
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.text(`${result.score}`, scoreBoxX + 10, scoreBoxY + 12);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('/ 100', scoreBoxX + 26, scoreBoxY + 10);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.text(badgeLabel.toUpperCase(), scoreBoxX + 6, scoreBoxY + 19);

  // Left explanation info
  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('The score is computed programmatically across four weighted metrics:', margin, y);

  // 3. Score Breakdown
  y += 8;
  const breakdownKeys = [
    { label: 'Skills Overlap (40%)', val: result.breakdown.skills },
    { label: 'Semantic Fit (30%)', val: result.breakdown.semantic },
    { label: 'Experience Alignment (20%)', val: result.breakdown.experience },
    { label: 'Education Relevance (10%)', val: result.breakdown.education },
  ];

  breakdownKeys.forEach((item) => {
    y += 5;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(item.label, margin, y);

    const scoreText = `${item.val.score} / ${item.val.max}`;
    doc.setFont('Helvetica', 'bold');
    doc.text(scoreText, margin + 70, y);

    // Mini details
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.val.details, margin + 95, y, { maxWidth: 75 });
  });

  y += 12;
  drawLine(y);

  // 4. Strategic Narrative
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Strategic Narrative Evaluation (Recruiter Summary)', margin, y);

  y += 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // slate-600
  
  // Format narrative text with text wrapping
  const narrativeLines = doc.splitTextToSize(result.narrative.reasoning, pageWidth - (margin * 2));
  doc.text(narrativeLines, margin, y);
  
  y += (narrativeLines.length * 4.5) + 6;
  drawLine(y);

  // 5. ATS Compatibility Section
  if (result.atsCompatibility) {
    checkPageOverflow(40);
    y += 10;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('ATS Compatibility Audit', margin, y);

    y += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`Overall ATS Score: ${result.atsCompatibility.score}/100    |    Formatting Compliance: ${result.atsCompatibility.formattingScore}%`, margin, y);

    y += 5;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const atsSum = doc.splitTextToSize(`Audit Summary: ${result.atsCompatibility.summary}`, pageWidth - (margin * 2));
    doc.text(atsSum, margin, y);
    y += (atsSum.length * 4.5) + 4;

    // Strengths
    if (result.atsCompatibility.strengths.length > 0) {
      checkPageOverflow(15);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text('✓ ATS Parsing Strengths:', margin, y);
      y += 4.5;
      doc.setFont('Helvetica', 'normal');
      result.atsCompatibility.strengths.forEach((str) => {
        const parsedStr = doc.splitTextToSize(str, pageWidth - (margin * 2) - 4);
        parsedStr.forEach((line: string) => {
          checkPageOverflow(5);
          doc.text(`• ${line}`, margin + 2, y);
          y += 4.5;
        });
      });
    }

    // Issues
    if (result.atsCompatibility.issues.length > 0) {
      checkPageOverflow(15);
      y += 2;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(245, 158, 11); // Amber
      doc.text('! ATS Formatting & Parse Issues:', margin, y);
      y += 4.5;
      doc.setFont('Helvetica', 'normal');
      result.atsCompatibility.issues.forEach((issue) => {
        const parsedIssue = doc.splitTextToSize(issue, pageWidth - (margin * 2) - 4);
        parsedIssue.forEach((line: string) => {
          checkPageOverflow(5);
          doc.text(`• ${line}`, margin + 2, y);
          y += 4.5;
        });
      });
    }

    y += 3;
    checkPageOverflow(10);
    drawLine(y);
  }

  // 6. Matched and Missing Skills
  checkPageOverflow(40);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Required Skill Analysis', margin, y);

  y += 6;
  const colWidth = (pageWidth - (margin * 2) - 10) / 2;

  // Matched Column
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.text('✓ Matched Skills', margin, y);
  
  let matchY = y + 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  
  const matchedList = result.matchedSkills.length > 0 ? result.matchedSkills : ['No explicit matching skills found.'];
  matchedList.forEach((skill) => {
    if (matchY > 260) {
      doc.addPage();
      matchY = margin + 10;
    }
    doc.text(`• ${skill}`, margin + 2, matchY);
    matchY += 4.5;
  });

  // Missing Column
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(217, 119, 6); // Amber-600
  doc.text('✗ Missing / Gaps', margin + colWidth + 5, y);

  let missingY = y + 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const missingList = result.missingSkills.length > 0 ? result.missingSkills : ['No major skill gaps identified.'];
  missingList.forEach((skill) => {
    if (missingY > 260) {
      if (matchY < missingY) {
        doc.addPage();
        missingY = margin + 10;
        matchY = margin + 10;
      } else {
        missingY = matchY;
      }
    }
    doc.text(`• ${skill}`, margin + colWidth + 7, missingY);
    missingY += 4.5;
  });

  y = Math.max(matchY, missingY) + 4;
  checkPageOverflow(10);
  drawLine(y);

  // 7. Priority-ranked missing skills section
  if (result.priorityMissingSkills && result.priorityMissingSkills.length > 0) {
    checkPageOverflow(30);
    y += 10;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Priority-Ranked Competency Gaps', margin, y);

    y += 6;
    doc.setFont('Helvetica', 'normal');
    result.priorityMissingSkills.forEach((item) => {
      checkPageOverflow(18);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      
      let pColor = [185, 28, 28]; // High - Red
      if (item.priority.toLowerCase() === 'medium') {
        pColor = [180, 83, 9]; // Medium - Amber
      } else if (item.priority.toLowerCase() === 'low') {
        pColor = [29, 78, 216]; // Low - Blue
      }
      
      doc.setTextColor(pColor[0], pColor[1], pColor[2]);
      doc.text(`[${item.priority.toUpperCase()}] ${item.name}`, margin, y);
      
      y += 4;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(item.description, pageWidth - (margin * 2) - 4);
      descLines.forEach((line: string) => {
        checkPageOverflow(5);
        doc.text(line, margin + 2, y);
        y += 4;
      });
      y += 1.5;
    });
    
    y += 3;
    checkPageOverflow(10);
    drawLine(y);
  }

  // 8. Optimization Recommendations
  checkPageOverflow(35);
  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Actionable Resume Recommendations', margin, y);

  y += 6;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const finalSuggestions = result.suggestions.length > 0 ? result.suggestions : ['No suggestions needed. Keep up the great profile alignment.'];
  finalSuggestions.forEach((suggestion) => {
    const lines = doc.splitTextToSize(suggestion, pageWidth - (margin * 2) - 6);
    lines.forEach((line: string) => {
      checkPageOverflow(5);
      doc.text(`• ${line}`, margin + 2, y);
      y += 4.5;
    });
    y += 1.5; // gap between suggestions
  });

  // Page Numbers & Footer on ALL pages
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Powered by Google Gemini Models • Strict Programmatic Scoring', margin, pageHeight - 12);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 12);
  }

  return doc;
}
