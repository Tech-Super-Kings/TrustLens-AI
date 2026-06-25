import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import type { ExtractedData } from '../models/Certificate.js';

const firstMatch = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }

  return undefined;
};

export const extractCredentialFields = (text: string): ExtractedData => {
  const normalized = text.replace(/\r/g, '\n');

  return {
    candidateName: firstMatch(normalized, [
      /(?:name|student name|candidate name)\s*[:\-]\s*([A-Z][A-Za-z. ]{2,80})/i,
      /(?:certify that|awarded to|presented to)\s+([A-Z][A-Za-z. ]{2,80})/i,
    ]),
    institutionName: firstMatch(normalized, [
      /(?:institution name|university|institute|college)\s*[:\-]?\s*([A-Z][A-Za-z&. ]{2,100})/i,
      /([A-Z][A-Za-z&. ]{2,100} (?:University|Institute|College))/,
    ]),
    degree: firstMatch(normalized, [
      /(?:degree|program|course)\s*[:\-]\s*([A-Za-z. ]{2,100})/i,
      /(Bachelor|Master|B\.Tech|M\.Tech|BSc|MSc|MBA|PhD)[A-Za-z. ]*/i,
    ]),
    department: firstMatch(normalized, [/department\s*[:\-]\s*([A-Za-z&. ]{2,80})/i, /(?:in|of)\s+([A-Za-z&. ]{2,80})\s+department/i]),
    registrationNumber: firstMatch(normalized, [/(?:registration\s*(?:no|number)?|reg\.?\s*no)\s*[:\-]?\s*([A-Z0-9/-]{4,40})/i]),
    certificateNumber: firstMatch(normalized, [/(?:certificate|cert\.?)\s*(?:no|number)?\s*[:\-]?\s*([A-Z0-9/-]{4,40})/i]),
    issueDate: firstMatch(normalized, [/(?:issue date|date of issue|issued on)\s*[:\-]?\s*([A-Za-z0-9,\-/ ]{6,30})/i]),
    graduationYear: firstMatch(normalized, [/(?:graduation year|year of passing|passed in)\s*[:\-]?\s*(20\d{2}|19\d{2})/i, /\b(20\d{2}|19\d{2})\b/]),
    cgpaOrGrade: firstMatch(normalized, [/(?:cgpa|grade|percentage)\s*[:\-]?\s*([A-Z0-9. %/]{1,20})/i]),
    signaturePresence: /signature|signed|registrar|controller of examinations/i.test(normalized),
    sealPresence: /seal|stamp|official mark|embossed/i.test(normalized),
    rawText: normalized.trim(),
  };
};

export const preprocessImageForOcr = async (filePath: string) => {
  const outputPath = `${filePath}.processed.png`;

  await sharp(filePath)
    .rotate()
    .greyscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(outputPath);

  return outputPath;
};

export const extractTextFromCertificate = async (filePath: string, mimeType: string) => {
  if (mimeType === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: buffer });

    try {
      const parsed = await parser.getText();
      return parsed.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  const processedImagePath = await preprocessImageForOcr(filePath);
  const worker = await createWorker('eng');

  try {
    const result = await worker.recognize(processedImagePath);
    return result.data.text.trim();
  } finally {
    await worker.terminate();
    await fs.rm(processedImagePath, { force: true });
  }
};
