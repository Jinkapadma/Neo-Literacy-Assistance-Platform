import { Assessment, AssessmentSubmission } from '../models/Assessment.model.js';
import { BenchmarkService } from '../services/benchmark.service.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getAllAssessments = asyncHandler(async (req, res) => {
  const { language, type, targetLevel, page = 1, limit = 10 } = req.query;

  const filter = { isPublished: true };
  if (language) filter.language = language;
  if (type) filter.type = type;
  if (targetLevel) filter.targetLevel = targetLevel;

  const skip = (Number(page) - 1) * Number(limit);

  const [assessments, total] = await Promise.all([
    Assessment.find(filter)
      .select('-questions.correctAnswer -questions.explanation') // Hide answers on general list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Assessment.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    {
      assessments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
    'Assessments fetched successfully'
  );
});

export const getAssessmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);

  if (!assessment) {
    throw ApiError.notFound('Assessment not found');
  }

  // If user is a learner, strip correct answers and explanations for secure test taking
  const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'educator');
  const payload = assessment.toObject();

  if (!isPrivileged) {
    payload.questions = payload.questions.map(q => {
      const { correctAnswer: _c, explanation: _e, ...cleanQ } = q;
      return cleanQ;
    });
  }

  return ApiResponse.success(res, payload, 'Assessment details retrieved successfully');
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const { assessmentId, answers, timeSpentSeconds } = req.body;
  const userId = req.user._id;

  const evaluationResult = await BenchmarkService.evaluateAssessmentSubmission(
    userId,
    assessmentId,
    answers,
    timeSpentSeconds
  );

  return ApiResponse.success(res, evaluationResult, 'Assessment evaluated and benchmark updated successfully');
});

export const getUserBenchmark = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Authorization check: User can view their own benchmark, or educators/admins can view any
  if (req.user.role === 'learner' && req.user._id.toString() !== userId) {
    throw ApiError.forbidden('You are not authorized to view this learner benchmark');
  }

  const benchmarkReport = await BenchmarkService.getUserBenchmark(userId);
  return ApiResponse.success(res, benchmarkReport, 'Learner benchmark retrieved successfully');
});

export const createAssessment = asyncHandler(async (req, res) => {
  const newAssessment = await Assessment.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return ApiResponse.created(res, newAssessment, 'Assessment created successfully');
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const submission = await AssessmentSubmission.findById(submissionId)
    .populate('assessmentId')
    .populate('userId', 'name email preferredLanguage proficiencyLevel');

  if (!submission) {
    throw ApiError.notFound('Assessment submission not found');
  }

  if (req.user.role === 'learner' && submission.userId._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You are not authorized to view this submission');
  }

  return ApiResponse.success(res, submission, 'Submission retrieved successfully');
});
