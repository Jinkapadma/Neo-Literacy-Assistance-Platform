import { Router } from 'express';
import {
  getAllAssessments,
  getAssessmentById,
  getInitialDiagnosticAssessment,
  submitAssessment,
  getUserBenchmark,
  createAssessment,
  getSubmissionById,
} from '../controllers/assessment.controller.js';
import { verifyJWT, optionalAuth, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  submitAssessmentSchema,
  createAssessmentSchema,
  getAssessmentsQuerySchema,
} from '../validators/assessment.validator.js';

const router = Router();

// Age- and Language-Adaptive Initial Diagnostic Assessment
router.get('/initial-diagnostic', optionalAuth, getInitialDiagnosticAssessment);

router.get('/', validate(getAssessmentsQuerySchema), getAllAssessments);

// Learner benchmark endpoint (Requirement: GET /api/assessments/benchmark/:userId)
router.get('/benchmark/:userId', verifyJWT, getUserBenchmark);

// Assessment submission endpoint (Requirement: POST /api/assessments/submit)
router.post('/submit', optionalAuth, validate(submitAssessmentSchema), submitAssessment);

router.get('/submissions/:submissionId', verifyJWT, getSubmissionById);

router.route('/:id')
  .get(optionalAuth, getAssessmentById);

router.post('/', verifyJWT, authorizeRoles('admin', 'educator'), validate(createAssessmentSchema), createAssessment);

export default router;
