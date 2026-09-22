import { Router } from 'express';
import {
  getCohortSummary,
  getLearnerRoster,
  getInterventionAlerts,
  getLearnerTrajectory,
} from '../controllers/analytics.controller.js';
import { verifyJWT, authorizeRoles, optionalAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Phase 4 Educator & Longitudinal Analytics Routes
router.get('/cohort-summary', optionalAuth, getCohortSummary);
router.get('/roster', optionalAuth, getLearnerRoster);
router.get('/intervention-alerts', optionalAuth, getInterventionAlerts);
router.get('/learner-trajectory/:userId', optionalAuth, getLearnerTrajectory);

export default router;
