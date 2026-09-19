import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import curriculumRoutes from './routes/curriculum.routes.js';
import contentRoutes from './routes/content.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Flexible for dev/vite
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL ? env.CLIENT_URL.replace(/\/+$/, '') : null,
  'https://neo-literacy-assistance-platform.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, health probes)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.includes(normalizedOrigin) ||
        /^https:\/\/neo-literacy-assistance-platform.*\.vercel\.app$/.test(normalizedOrigin) ||
        /^https:\/\/.*\.vercel\.app$/.test(normalizedOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error(`CORS origin not allowed: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// HTTP Request Logger via Morgan streaming into Winston
const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: message => logger.http(message.trim()),
    },
  })
);

// General API Rate Limiting
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP, please try again later.',
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return ApiResponse.success(
    res,
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    },
    'Literacy Assistance API is healthy and operational'
  );
});

// Phase 1 Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/assessments', assessmentRoutes);

// =========================================================================
// PHASE 2 & 3 STUBBED ENDPOINTS (Deferred to subsequent development phases)
// =========================================================================
app.all('/api/ai/*', (req, res) => {
  // TODO: Phase 2 - Implement AI-powered Personalized Learning Path & Recommendation Engine
  return ApiResponse.success(
    res,
    { status: 'STUB_PHASE_2', message: 'AI Personalization Engine will be implemented in Phase 2.' },
    'AI Personalization Engine (Phase 2 Roadmap)'
  );
});

app.all('/api/voice/*', (req, res) => {
  // TODO: Phase 3 - Implement Speech-to-Text & Real-Time Pronunciation Assessment Engine
  return ApiResponse.success(
    res,
    { status: 'STUB_PHASE_3', message: 'Voice Recognition & Pronunciation Evaluator will be implemented in Phase 3.' },
    'Voice & Pronunciation Assessment Engine (Phase 3 Roadmap)'
  );
});

app.all('/api/analytics/*', (req, res) => {
  // TODO: Phase 4 - Implement Educator Real-Time Dashboards & Longitudinal Literacy Analytics
  return ApiResponse.success(
    res,
    { status: 'STUB_PHASE_4', message: 'Advanced Analytics and Educator Dashboards will be implemented in Phase 4.' },
    'Analytics & Dashboards (Phase 4 Roadmap)'
  );
});

// 404 Handler & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
