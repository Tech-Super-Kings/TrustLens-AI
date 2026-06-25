import fs from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import type { ExtractedData } from '../models/Certificate.js';

const ignoredInstitutionFragments = [
  'approved by',
  'affiliated to',
  'recognized by',
  'accredited by',
  'aicte',
  'ugc',
  'iso',
  'ministry',
  'government of',
];

const fieldLabels = [
  'candidate name',
  'student name',
  'name',
  'institution name',
  'university',
  'college',
  'institute',
  'degree',
  'program',
  'course',
  'department',
  'registration',
  'reg no',
  'certificate no',
  'certificate number',
  'issue date',
  'date of issue',
  'cgpa',
  'grade',
  'percentage',
];

const cleanValue = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/[|_]+/g, ' ')
    .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9)./%-]+$/g, '')
    .trim();

const isLikelyLabel = (value: string) => fieldLabels.includes(value.toLowerCase().replace(/[:.-]/g, '').trim());

const getLines = (text: string) =>
  text
    .replace(/\r/g, '\n')
    .split('\n')
    .map(cleanValue)
    .filter((line) => line.length > 1);

const firstMatch = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = cleanValue(match[1]);
      if (value && !isLikelyLabel(value)) {
        return value;
      }
    }
  }

  return undefined;
};

const valueAfterLabel = (lines: string[], labels: RegExp[], validator?: (value: string) => boolean) => {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    for (const label of labels) {
      const sameLine = line.match(label);
      const value = sameLine?.[1] ? cleanValue(sameLine[1]) : undefined;

      if (value && !isLikelyLabel(value) && (!validator || validator(value))) {
        return value;
      }

      if (label.test(line) && lines[index + 1]) {
        const nextLine = cleanValue(lines[index + 1]);
        if (!isLikelyLabel(nextLine) && (!validator || validator(nextLine))) {
          return nextLine;
        }
      }
    }
  }

  return undefined;
};

const isLikelyPersonName = (value: string) => {
  const lower = value.toLowerCase();
  return /^[A-Za-z][A-Za-z. ]{2,80}$/.test(value) && !/(university|college|institute|faculty|department|approved|certificate|course|degree)/i.test(lower);
};

const isLikelyInstitution = (value: string) => {
  const lower = value.toLowerCase();
  return (
    /(university|college|institute|school|academy|vidyapeeth|polytechnic)/i.test(value) &&
    !ignoredInstitutionFragments.some((fragment) => lower.includes(fragment))
  );
};

const isLikelyIdentifier = (value: string) => /[0-9]/.test(value) && /^[A-Z0-9][A-Z0-9/_.-]{3,45}$/i.test(value);

const findInstitution = (lines: string[], text: string) => {
  const labelled = valueAfterLabel(lines, [/^(?:institution name|name of institution|college name|university name)\s*[:\-]\s*(.+)$/i], isLikelyInstitution);
  if (labelled) {
    return labelled;
  }

  return lines.find(isLikelyInstitution) ?? firstMatch(text, [/([A-Z][A-Za-z&. ]{2,100} (?:University|Institute|College|Academy|Polytechnic))/]);
};

export const extractCredentialFields = (text: string): ExtractedData => {
  const normalized = text.replace(/\r/g, '\n');
  const lines = getLines(normalized);

  return {
    candidateName:
      valueAfterLabel(lines, [/^(?:candidate name|student name|name of student|name)\s*[:\-]\s*(.+)$/i], isLikelyPersonName) ??
      firstMatch(normalized, [/(?:certify that|awarded to|presented to)\s+([A-Z][A-Za-z. ]{2,80})(?:\s+has|\s+is|\s+for|\n)/i]),
    institutionName: findInstitution(lines, normalized),
    degree:
      valueAfterLabel(lines, [/^(?:degree|program|course|qualification)\s*[:\-]\s*(.+)$/i]) ??
      firstMatch(normalized, [/\b((?:Bachelor|Master|B\.?\s?Tech|M\.?\s?Tech|BSc|MSc|MBA|PhD|Diploma)[A-Za-z. ]{0,80})/i]),
    department:
      valueAfterLabel(lines, [/^department\s*[:\-]\s*(.+)$/i]) ??
      firstMatch(normalized, [/(?:department of|in the department of)\s+([A-Za-z&. ]{2,80})/i]),
    registrationNumber: valueAfterLabel(lines, [/^(?:registration|registration no|registration number|reg\.?\s*no|roll no|enrollment no)\s*[:\-]\s*([A-Z0-9/_.-]{4,45})$/i], isLikelyIdentifier),
    certificateNumber: valueAfterLabel(lines, [/^(?:certificate no|certificate number|certificate id|cert\.?\s*no)\s*[:\-]\s*([A-Z0-9/_.-]{4,45})$/i], isLikelyIdentifier),
    issueDate: valueAfterLabel(lines, [/^(?:issue date|date of issue|issued on|date)\s*[:\-]\s*([A-Za-z0-9,\-/ ]{6,30})$/i]),
    graduationYear: firstMatch(normalized, [/(?:graduation year|year of passing|passed in)\s*[:\-]?\s*(20\d{2}|19\d{2})/i, /\b(20\d{2}|19\d{2})\b/]),
    cgpaOrGrade: valueAfterLabel(lines, [/^(?:cgpa|grade|percentage|gpa)\s*[:\-]\s*([A-Z0-9. %/]{1,20})$/i]),
    signaturePresence: /signature|signed|registrar|controller of examinations/i.test(normalized),
    sealPresence: /seal|stamp|official mark|embossed/i.test(normalized),
    rawText: normalized.trim(),
  };
};

export const preprocessImageForOcr = async (filePath: string) => {
  const outputPath = `${filePath}.processed.png`;

  await sharp(filePath)
    .rotate()
    .resize({ width: 2200, withoutEnlargement: true })
    .greyscale()
    .normalize()
    .linear(1.18, -8)
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
    await worker.setParameters({
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });
    const processedResult = await worker.recognize(processedImagePath);
    const originalResult = await worker.recognize(filePath);
    const processedText = processedResult.data.text.trim();
    const originalText = originalResult.data.text.trim();

    return processedText.length >= originalText.length ? processedText : originalText;
  } finally {
    await worker.terminate();
    await fs.rm(processedImagePath, { force: true });
  }
};
