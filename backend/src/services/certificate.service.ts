import fs from 'node:fs/promises';
import mongoose from 'mongoose';
import { AnalysisHistory } from '../models/AnalysisHistory.js';
import { Certificate } from '../models/Certificate.js';
import type { IUser } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { serializeCertificate } from '../utils/certificateSerializer.js';
import { analyzeCredentialWithGemini } from './gemini.service.js';
import { extractCredentialFields, extractTextFromCertificate } from './ocr.service.js';
import { detectTamperingSignals } from './tampering.service.js';

export const createCertificateFromUpload = async (user: IUser, file: Express.Multer.File) => {
  const certificate = await Certificate.create({
    userId: user.id,
    fileName: file.filename,
    originalName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    fileSize: file.size,
    verificationStatus: 'Uploaded',
  });

  return serializeCertificate(certificate);
};

export const analyzeCertificate = async (user: IUser, certificateId: string) => {
  const startedAt = Date.now();
  const certificate = await findAccessibleCertificate(user, certificateId);

  const ocrText = await extractTextFromCertificate(certificate.filePath, certificate.fileType);
  const extractedData = extractCredentialFields(ocrText);
  const tamperingFindings = await detectTamperingSignals(certificate.filePath, extractedData);
  const aiResponse = await analyzeCredentialWithGemini(extractedData, tamperingFindings);

  certificate.extractedData = extractedData;
  certificate.authenticityScore = aiResponse.authenticityScore;
  certificate.confidenceScore = aiResponse.confidence;
  certificate.riskLevel = aiResponse.riskLevel;
  certificate.aiSummary = aiResponse.summary;
  certificate.issues = [...aiResponse.issues, ...tamperingFindings];
  certificate.recommendations = aiResponse.recommendations;
  certificate.tamperingFindings = tamperingFindings;
  certificate.verificationStatus = aiResponse.riskLevel === 'High' ? 'Pending Review' : 'Analyzed';

  await certificate.save();

  await AnalysisHistory.create({
    certificateId: certificate.id,
    analysisType: 'AI Credential Analysis',
    timestamp: new Date(),
    aiResponse,
    processingTime: Date.now() - startedAt,
  });

  return serializeCertificate(certificate);
};

export const findAccessibleCertificate = async (user: IUser, certificateId: string) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, 'Invalid certificate ID');
  }

  const query = user.role === 'admin' || user.role === 'employer' ? { _id: certificateId } : { _id: certificateId, userId: user.id };
  const certificate = await Certificate.findOne(query);

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  return certificate;
};

export const listCertificatesForUser = async (user: IUser, filters: Record<string, string | undefined>) => {
  const query: Record<string, unknown> = {};

  if (user.role !== 'admin' && user.role !== 'employer') {
    query.userId = user.id;
  }

  if (filters.status) {
    query.verificationStatus = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { 'extractedData.candidateName': new RegExp(filters.search, 'i') },
      { 'extractedData.institutionName': new RegExp(filters.search, 'i') },
      { 'extractedData.certificateNumber': new RegExp(filters.search, 'i') },
      { originalName: new RegExp(filters.search, 'i') },
    ];
  }

  const certificates = await Certificate.find(query).sort({ uploadedAt: -1 }).limit(100);
  return certificates.map(serializeCertificate);
};

export const deleteCertificate = async (user: IUser, certificateId: string) => {
  const certificate = await findAccessibleCertificate(user, certificateId);

  if (user.role === 'employer') {
    throw new ApiError(403, 'Employers have read-only verification access');
  }

  await AnalysisHistory.deleteMany({ certificateId: certificate.id });
  await Certificate.deleteOne({ _id: certificate.id });
  await fs.rm(certificate.filePath, { force: true });
};

export const getCertificateHistory = async (user: IUser) => {
  const certificateQuery = user.role === 'admin' || user.role === 'employer' ? {} : { userId: user.id };
  const certificates = await Certificate.find(certificateQuery).select('_id');
  const certificateIds = certificates.map((certificate) => certificate.id);

  return AnalysisHistory.find({ certificateId: { $in: certificateIds } })
    .populate('certificateId', 'originalName extractedData verificationStatus riskLevel authenticityScore uploadedAt')
    .sort({ timestamp: -1 })
    .limit(100);
};
