import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const uploadDirectory = path.resolve(process.cwd(), 'uploads', 'certificates');
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const certificateUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new ApiError(400, 'Unsupported file type. Upload PDF, PNG, JPG, or JPEG files only.'));
      return;
    }

    cb(null, true);
  },
});
