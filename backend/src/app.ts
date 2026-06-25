import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { certificateRouter } from './routes/certificate.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
  }),
);
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  '/uploads',
  express.static(path.resolve(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', env.clientUrl);
    },
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TrustLens AI API is healthy' });
});

app.use('/api/auth', authRouter);
app.use('/api', authRouter);
app.use('/api/certificate', certificateRouter);

app.use(notFound);
app.use(errorHandler);
