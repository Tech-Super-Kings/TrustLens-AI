import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import type { ExtractedData, RiskLevel } from '../models/Certificate.js';

export type CredentialAnalysis = {
  authenticityScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  summary: string;
  issues: string[];
  recommendations: string[];
};

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

const fallbackAnalysis = (data: ExtractedData, tamperingFindings: string[]): CredentialAnalysis => {
  const missingFields = [
    ['candidate name', data.candidateName],
    ['institution name', data.institutionName],
    ['degree', data.degree],
    ['certificate number', data.certificateNumber || data.registrationNumber],
    ['issue date or graduation year', data.issueDate || data.graduationYear],
  ].filter(([, value]) => !value);

  const score = clampScore(94 - missingFields.length * 8 - Math.max(0, tamperingFindings.length - 1) * 4);
  const riskLevel: RiskLevel = score >= 80 ? 'Low' : score >= 55 ? 'Medium' : 'High';

  return {
    authenticityScore: score,
    riskLevel,
    confidence: clampScore(88 - missingFields.length * 5),
    summary: missingFields.length === 0 ? 'Certificate appears structurally consistent based on OCR and heuristic checks.' : 'Certificate requires review because important fields were not confidently extracted.',
    issues: missingFields.length > 0 ? missingFields.map(([label]) => `Missing or unclear ${label}.`) : ['No significant anomalies detected by fallback analysis.'],
    recommendations: riskLevel === 'Low' ? ['Proceed with blockchain verification in Phase 3.'] : ['Request issuer-side validation before blockchain registration.'],
  };
};

const parseStructuredJson = (text: string): CredentialAnalysis | null => {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as CredentialAnalysis;

    return {
      authenticityScore: clampScore(Number(parsed.authenticityScore)),
      riskLevel: parsed.riskLevel,
      confidence: clampScore(Number(parsed.confidence)),
      summary: String(parsed.summary),
      issues: Array.isArray(parsed.issues) ? parsed.issues.map(String) : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : [],
    };
  } catch {
    return null;
  }
};

export const analyzeCredentialWithGemini = async (data: ExtractedData, tamperingFindings: string[]) => {
  if (!env.geminiApiKey) {
    return fallbackAnalysis(data, tamperingFindings);
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
You are TrustLens AI. Analyze this OCR-extracted credential data for authenticity.
Return structured JSON only with keys: authenticityScore, riskLevel, confidence, summary, issues, recommendations.
Check formatting consistency, suspicious wording, impossible dates, missing fields, institution naming consistency, and explain anomalies.
Do not claim certainty; provide risk-based analysis.
Important parsing guidance:
- Treat regulatory lines such as "Approved by AICTE", "Affiliated to", "Recognized by", "UGC", or accreditation text as metadata, not the institution name.
- Treat generic words like "FACULTY", "CERTIFICATE", "GRADE", "DEPARTMENT", and headings as labels, not certificate numbers.
- A certificate or registration number should usually contain digits and appear near labels such as Certificate No, Registration No, Roll No, or Enrollment No.
- If an extracted field appears suspiciously generic, mention it as an issue instead of assuming it is correct.

Extracted data:
${JSON.stringify(data, null, 2)}

Tampering findings:
${JSON.stringify(tamperingFindings, null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseStructuredJson(text) ?? fallbackAnalysis(data, tamperingFindings);
  } catch {
    return fallbackAnalysis(data, tamperingFindings);
  }
};
