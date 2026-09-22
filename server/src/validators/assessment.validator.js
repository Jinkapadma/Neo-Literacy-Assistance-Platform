import { z } from 'zod';

const languageEnum = z.enum(['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr']);
const targetLevelEnum = z.enum(['beginner', 'elementary', 'intermediate', 'advanced']);
const assessmentTypeEnum = z.enum(['reading', 'writing', 'comprehension', 'benchmark']);
const questionTypeEnum = z.enum([
  'multiple_choice',
  'reading_passage',
  'word_completion',
  'sentence_reorder',
  'picture_match',
  'fill_in_blank',
]);
const skillCategoryEnum = z.enum(['phonics', 'vocabulary', 'reading', 'writing', 'comprehension']);

export const submitAssessmentSchema = z.object({
  body: z.object({
    assessmentId: z.string().min(1, 'Assessment ID is required'),
    timeSpentSeconds: z.number().min(0).optional().default(0),
    answers: z
      .array(
        z.object({
          questionId: z.string().min(1, 'Question ID is required'),
          selectedAnswer: z.string().optional().default(''),
        })
      )
      .optional()
      .default([]),
  }),
});

export const createAssessmentSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    code: z.string().min(2).max(30),
    description: z.string().optional(),
    language: languageEnum,
    type: assessmentTypeEnum,
    targetLevel: targetLevelEnum.default('beginner'),
    timeLimitMinutes: z.number().min(1).default(15),
    totalPoints: z.number().min(10).default(100),
    questions: z.array(
      z.object({
        questionId: z.string().min(1),
        type: questionTypeEnum,
        prompt: z.string().min(1),
        passage: z.string().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
        audioUrl: z.string().url().optional().or(z.literal('')),
        options: z.array(z.string()).optional(),
        correctAnswer: z.string().min(1),
        points: z.number().min(1).default(10),
        skillCategory: skillCategoryEnum,
        explanation: z.string().optional(),
      })
    ).min(1, 'At least one question is required'),
  }),
});

export const getAssessmentsQuerySchema = z.object({
  query: z.object({
    language: languageEnum.optional(),
    type: assessmentTypeEnum.optional(),
    targetLevel: targetLevelEnum.optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(50).default(10).optional(),
  }),
});
