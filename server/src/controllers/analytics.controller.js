import { EducatorAnalyticsService } from '../services/educatorAnalytics.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getCohortSummary = asyncHandler(async (req, res) => {
  const educatorId = req.user?._id;
  const summary = await EducatorAnalyticsService.getCohortSummary(educatorId);
  return ApiResponse.success(res, summary, 'Cohort summary analytics retrieved successfully');
});

export const getLearnerRoster = asyncHandler(async (req, res) => {
  const roster = await EducatorAnalyticsService.getLearnerRoster();
  return ApiResponse.success(res, roster, 'Learner class roster retrieved successfully');
});

export const getInterventionAlerts = asyncHandler(async (req, res) => {
  const alerts = await EducatorAnalyticsService.getInterventionAlerts();
  return ApiResponse.success(res, alerts, 'Intervention alerts retrieved successfully');
});

export const getLearnerTrajectory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const trajectory = await EducatorAnalyticsService.getLearnerTrajectory(userId);
  return ApiResponse.success(res, trajectory, 'Learner longitudinal trajectory retrieved successfully');
});
