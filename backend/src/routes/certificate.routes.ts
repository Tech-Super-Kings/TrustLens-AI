import { Router } from 'express';
import { analyzeUploadedCertificate, getCertificate, getCertificates, getHistory, removeCertificate, uploadCertificate } from '../controllers/certificate.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { certificateUpload } from '../middleware/upload.middleware.js';

export const certificateRouter = Router();

certificateRouter.use(authenticate);

certificateRouter.post('/upload', authorize('student', 'university', 'admin'), certificateUpload.single('certificate'), uploadCertificate);
certificateRouter.post('/analyze', authorize('student', 'university', 'admin'), analyzeUploadedCertificate);
certificateRouter.get('/history', getHistory);
certificateRouter.get('/', getCertificates);
certificateRouter.get('/:id', getCertificate);
certificateRouter.delete('/:id', authorize('student', 'university', 'admin'), removeCertificate);
