# Literacy Assistance Platform - Backend API (Phase 1)

Production-grade Node.js & Express REST API with MongoDB/Mongoose for the AI-Based Intelligent Literacy Assistance Platform for Neo-Learners.

## Features in Phase 1
- **Authentication**: JWT access + refresh token rotation, bcrypt password hashing, rate limiting, and role-based permissions (`learner`, `educator`, `admin`).
- **User Profile Management**: Preferred language selection, target skills, benchmark history, and profile updates.
- **Curriculum Architecture**: Hierarchical curriculum structure (Curriculum → Modules → Lessons) supporting progressive literacy development.
- **Multilingual Content Repository**: Multilingual content management (English, Hindi, Spanish, etc.), difficulty levels, audio/visual metadata, vocabulary breakdowns, and comprehension checkpoints.
- **Assessment & Proficiency Benchmarks**: Reading, writing, and comprehension assessments with automated benchmark scoring (`beginner`, `elementary`, `intermediate`, `advanced`) and strengths/weakness diagnostics.
- **Security & Quality**: Helmet, CORS, NoSQL injection sanitization (`express-mongo-sanitize`), request rate limiting, centralized Zod validation, custom `ApiError` handling, and Winston logging.

## API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register learner / educator | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT tokens | Public |
| `POST` | `/api/auth/refresh` | Refresh expired access token | Public |
| `POST` | `/api/auth/logout` | Invalidate refresh token session | Authenticated |
| `GET` | `/api/users/profile` | Get current user's profile | Authenticated |
| `PUT` | `/api/users/profile` | Update profile / language / skills | Authenticated |
| `GET` | `/api/curriculum` | List published curricula | Public |
| `GET` | `/api/curriculum/:id` | Get curriculum module details | Public |
| `POST` | `/api/curriculum` | Create curriculum | Admin / Educator |
| `PUT` | `/api/curriculum/:id` | Update curriculum | Admin / Educator |
| `DELETE` | `/api/curriculum/:id` | Delete curriculum | Admin |
| `GET` | `/api/content` | Filter multilingual learning content | Public |
| `GET` | `/api/content/:id` | Get content item with translations | Public |
| `POST` | `/api/content` | Create learning content item | Admin / Educator |
| `PUT` | `/api/content/:id` | Update learning content item | Admin / Educator |
| `DELETE` | `/api/content/:id` | Delete learning content item | Admin |
| `GET` | `/api/assessments` | List available assessments | Public |
| `GET` | `/api/assessments/:id` | Get assessment questions | Public / Learner |
| `POST` | `/api/assessments/submit` | Submit test & compute benchmark | Authenticated Learner |
| `GET` | `/api/assessments/benchmark/:userId` | Get user benchmark scorecard | Authenticated |

## Setup & Running

```bash
# Install dependencies
npm install

# Seed database with rich sample data
npm run seed

# Run dev server with live reload
npm run dev
```
