import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.routes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { getAudioDir, cleanupExpired, getTtlMs } from './services/storage.js';
import { logger } from './utils/logger.js';

// Load environment variables from the project-root .env, then any local one.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 5000;

// Last-resort guards: a broken external-service interaction must never crash
// the whole server. Errors are logged; the process keeps serving requests.
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception (server kept running):', err);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection (server kept running):', reason);
});

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security headers (explicit CSP without `upgrade-insecure-requests`
// so the API also works on plain http:// in local development / production).
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        mediaSrc: ["'self'", 'blob:', 'data:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
  }),
);

// CORS: in development the Vite dev server origin is allowed; configurable via env.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests (curl, proxies) and configured origins are allowed.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  }),
);

app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use('/api', apiLimiter, apiRoutes);

// Generated audio files (temporary; cleaned up on an interval).
app.use(
  '/audio',
  express.static(getAudioDir(), {
    index: false,
    maxAge: getTtlMs(),
    setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=900'),
  }),
);

// In production, serve the built React client if it exists.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: 'index.html' }));
  app.get(/^(?!\/api\/|\/audio\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT} (provider: ${process.env.TTS_PROVIDER || 'edge'})`);
});

// Periodically remove expired audio files.
const cleanupTimer = setInterval(cleanupExpired, 60 * 1000);
cleanupTimer.unref();

export { app, server };
