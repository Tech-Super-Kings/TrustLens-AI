import path from 'node:path';
import type { ICertificate } from '../models/Certificate.js';

export const serializeCertificate = (certificate: ICertificate) => {
  const raw = certificate.toJSON();
  const publicFileName = path.basename(certificate.filePath);

  return {
    ...raw,
    previewUrl: `/uploads/certificates/${publicFileName}`,
    blockchainStatus: 'Pending Blockchain Registration',
  };
};
