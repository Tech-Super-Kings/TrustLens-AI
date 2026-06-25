import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TrustLens AI API is healthy' });
});

app.use('/api/auth', authRouter);
app.use('/api', authRouter);

app.use(notFound);
app.use(errorHandler);
