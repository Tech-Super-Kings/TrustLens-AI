import type { Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { serializeCertificate } from '../utils/certificateSerializer.js';
import { analyzeCertificate, createCertificateFromUpload, deleteCertificate, findAccessibleCertificate, getCertificateHistory, listCertificatesForUser } from '../services/certificate.service.js';

export const uploadCertificate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  if (!req.file) {
    throw new ApiError(400, 'Certificate file is required');
  }

  const certificate = await createCertificateFromUpload(req.user, req.file);
  res.status(201).json({ success: true, certificate });
});

export const analyzeUploadedCertificate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const certificate = await analyzeCertificate(req.user, req.body.certificateId);
  res.status(200).json({ success: true, certificate });
});

export const getCertificate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const certificate = await findAccessibleCertificate(req.user, String(req.params.id));
  res.status(200).json({ success: true, certificate: serializeCertificate(certificate) });
});

export const getCertificates = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const certificates = await listCertificatesForUser(req.user, {
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
    status: typeof req.query.status === 'string' ? req.query.status : undefined,
  });
  res.status(200).json({ success: true, certificates });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const history = await getCertificateHistory(req.user);
  res.status(200).json({ success: true, history });
});

export const removeCertificate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  await deleteCertificate(req.user, String(req.params.id));
  res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
});
