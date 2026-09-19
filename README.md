# AI-Based Intelligent Literacy Assistance Platform for Neo-Learners
### **Phase 1: Learning Content Management & Assessment Framework**

A production-grade, full-stack literacy education platform engineered specifically for adult neo-learners, low-literacy individuals, and multilingual students.

---

## 🌟 Key Highlights of Phase 1

1. **Curriculum Architecture & Roadmap**:
   - Structured hierarchy: **Curriculum** ➔ **Modules** ➔ **Lessons** ➔ **Content References**.
   - Progressive sequencing (Phonics, High-Frequency Words, Sentence Building, Everyday Comprehension).
2. **Multilingual Learning Content Repository**:
   - Multilingual content support across 8 languages (English, Hindi, Spanish, French, Bengali, Telugu, Tamil, Marathi) with native script rendering.
   - Rich media metadata, phonetic pronunciation guides, vocabulary cards, and interactive comprehension checkpoints.
3. **Authentication & Profile Benchmarks**:
   - JWT authentication pattern with access token stored securely in client memory and httpOnly refresh token cookie rotation.
   - Diagnostic proficiency level benchmark calculation (`beginner`, `elementary`, `intermediate`, `advanced`).
4. **Interactive Multi-Modal Assessments**:
   - Reading comprehension passages with audio narration.
   - Word spelling, sentence reordering, and multiple-choice diagnostic tests.
   - Instant proficiency scorecard with strengths, improvement areas, and recommended next steps.
5. **Universal Accessibility Suite for Neo-Learners**:
   - **Dyslexia-friendly font** toggle (Lexend/OpenDyslexic style).
   - **High-contrast dark mode** for visual impairment.
   - **Text size scaling** (Normal, Large, Extra Large).
   - **Integrated Text-to-Speech (TTS)** reading helper allowing learners to click any passage or word to hear it pronounced.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance, accessible, responsive client |
| **Routing & Forms** | React Router v6, React Hook Form, Zod | Schema validation, type-safe client forms |
| **Icons & Alerts** | Lucide React, React Hot Toast | Icon-driven neo-learner UI, toast notifications |
| **Backend** | Node.js, Express.js | Production RESTful MVC API |
| **Database** | MongoDB with Mongoose ODM | Document storage, indexes, relational references |
| **Authentication** | JWT (Access + Refresh Tokens), bcryptjs | Secure password hashing, token rotation |
| **Security & Logging** | Helmet, CORS, Express-Rate-Limit, Winston | Security headers, sanitization, structured logs |

---

## 📂 Project Architecture

```
Project1/
├── server/                      # Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection & Zod validated env
│   │   ├── models/              # User, Curriculum, Content, Assessment schemas
│   │   ├── controllers/         # Auth, User, Curriculum, Content, Assessment controllers
│   │   ├── routes/              # Express API routers
│   │   ├── middlewares/         # JWT verify, Zod validator, error handler, rate limit
│   │   ├── services/            # Benchmark algorithm, auth service, content service
│   │   ├── utils/               # ApiError, ApiResponse envelope, Winston logger
│   │   ├── validators/          # Zod request validation schemas
│   │   ├── scripts/seed.js      # Multilingual seed script
│   │   ├── app.js               # Express application config
│   │   └── server.js            # Server entry point
│   ├── .env.example
│   └── package.json
│
├── client/                      # React (Vite) Frontend
│   ├── src/
│   │   ├── api/                 # Axios instance with 401 token refresh queue
│   │   ├── components/
│   │   │   ├── common/          # Button, Input, Card, Modal, Loader, LanguageSwitcher, Badge
│   │   │   ├── layout/          # Navbar, Sidebar, Footer, Layout, ProtectedRoute
│   │   │   └── assessment/      # AssessmentCard, QuestionRenderer, BenchmarkMeter
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── profile/         # LearnerProfile (Benchmark history & settings)
│   │   │   ├── curriculum/      # CurriculumList, CurriculumDetail
│   │   │   ├── content/         # ContentLibrary (Multilingual reader modal)
│   │   │   ├── assessment/      # AssessmentPage (Test runner), AssessmentResult
│   │   │   ├── Home.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/             # AuthContext, AccessibilityContext
│   │   ├── hooks/               # useAuth, useAccessibility, useFetch
│   │   ├── routes/AppRoutes.jsx # Route configurations
│   │   └── index.css            # Tailwind directives & accessibility themes
│   ├── tailwind.config.js
│   └── package.json
│
├── postman_collection_Phase1.json   # Postman API Collection
├── thunder-collection_Phase1.json   # Thunder Client API Collection
└── package.json                     # Root orchestrator
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 2. Quick Setup (Root)

Run the root installer to set up all dependencies across root, server, and client:

```bash
npm run install:all
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env` in `server/`:

```bash
# In server/.env:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/literacy_assistance_db
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=literacy_super_secure_access_secret_key_2026_x89f
JWT_REFRESH_SECRET=literacy_super_secure_refresh_secret_key_2026_q47z
```

### 4. Seed Multilingual Dataset

Populate sample users, curricula, multilingual reading passages, and diagnostic assessments:

```bash
npm run seed
```

#### Pre-seeded Demo Accounts:
| Role | Email | Password | Primary Language |
|---|---|---|---|
| **Learner (Hindi)** | `learner@literacy.org` | `Password123!` | Hindi (हिंदी) |
| **Learner (English)** | `learner.en@literacy.org` | `Password123!` | English |
| **Learner (Spanish)** | `learner.es@literacy.org` | `Password123!` | Spanish (Español) |
| **Educator** | `educator@literacy.org` | `Password123!` | Hindi |
| **Admin** | `admin@literacy.org` | `Password123!` | English |

### 5. Run the Application Concurrently

Start both the Express backend API (`localhost:5000`) and the Vite React frontend (`localhost:5173`) in one command:

```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 End-to-End Verification Flow

1. **Register or Login**:
   - Go to `/login`, use quick-fill buttons (e.g. `learner@literacy.org`) or click `/register` to create a new profile.
2. **View Curriculum**:
   - Navigate to `/curriculum` to browse structured tracks. Open "Foundational English Literacy" or "बुनियादी हिंदी साक्षरता" to see module roadmaps and lesson objectives.
3. **Multilingual Content Library**:
   - Navigate to `/content`. Switch languages using the top dropdown. Click **"Read & Practice"** on any story to open the Interactive Reader.
   - Click **"Listen Aloud"** to hear speech synthesis. Review key vocabulary and test yourself on comprehension questions.
4. **Diagnostic Assessment & Benchmark Calculation**:
   - Navigate to `/assessment`. Click **"Start Assessment"** on the English or Hindi Benchmark test.
   - Answer the reading, spelling, and passage questions.
   - Submit the test and view the calculated **Proficiency Benchmark Scorecard** with percentage breakdown across Reading, Writing, and Comprehension.
5. **Learner Profile**:
   - Navigate to `/profile` to view your updated assigned tier (`Novice`, `Elementary`, `Functional`, `Fluent`), active literacy goals, and historical assessment records.

---

## 🗺️ Roadmap Ahead
- **Phase 2 (Weeks 3–4)**: AI-driven personalized learning path and adaptive exercise recommendations.
- **Phase 3 (Weeks 5–6)**: Speech recognition, real-time phonetic feedback, and voice-assisted reading assessments.
- **Phase 4 (Weeks 7–8)**: Educator longitudinal dashboards, student cohort tracking, and automated progress reports.
