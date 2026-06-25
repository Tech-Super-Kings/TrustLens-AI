import fs from 'node:fs/promises';
import type { ExtractedData } from '../models/Certificate.js';

const countRepeatedLines = (rawText = '') => {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 8);
  const seen = new Set<string>();
  let duplicates = 0;

  for (const line of lines) {
    if (seen.has(line)) {
      duplicates += 1;
    }
    seen.add(line);
  }

  return duplicates;
};

export const detectTamperingSignals = async (filePath: string, data: ExtractedData) => {
  const findings: string[] = [];
  const stats = await fs.stat(filePath);
  const rawText = data.rawText ?? '';

  if (!data.sealPresence) {
    findings.push('Official seal or stamp was not confidently detected.');
  }

  if (!data.signaturePresence) {
    findings.push('Signature marker was not confidently detected.');
  }

  if (countRepeatedLines(rawText) > 1) {
    findings.push('Repeated text regions were found in OCR output and should be reviewed.');
  }

  if (rawText.length < 80) {
    findings.push('OCR extracted limited text; cropped regions, blur, or low contrast may be present.');
  }

  if (stats.size < 25 * 1024) {
    findings.push('File size is unusually small for a certificate scan, which may indicate compression artifacts.');
  }

  if (!data.certificateNumber && !data.registrationNumber) {
    findings.push('No certificate or registration number was detected.');
  }

  findings.push('Font-size variance, blurred signatures, and compression mismatch checks are heuristic only and require manual review for final decisions.');

  return findings;
};
