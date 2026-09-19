import { z } from 'zod';

const languageEnum = z.enum(['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr']);
const targetLevelEnum = z.enum(['beginner', 'elementary', 'intermediate', 'advanced']);
const categoryEnum = z.enum([
  'Alphabet & Phonics',
  'Sight Words & Vocabulary',
  'Sentence Building',
  'Reading Comprehension',
  'Daily Life & Functional Literacy',
]);

const lessonSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(2),
  type: z.enum(['phonics', 'vocabulary', 'sentence_structure', 'story_reading', 'comprehension', 'practical_usage']),
  description: z.string().optional(),
  contentRef: z.string().optional(),
  order: z.number().default(1),
  objectives: z.array(z.string()).optional(),
  estimatedMinutes: z.number().default(10),
});

const moduleSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  order: z.number().default(1),
  lessons: z.array(lessonSchema).default([]),
  badgeReward: z.string().optional(),
});

export const createCurriculumSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    code: z.string().min(2).max(30),
    description: z.string().optional(),
    language: languageEnum,
    targetLevel: targetLevelEnum.default('beginner'),
    category: categoryEnum.default('Alphabet & Phonics'),
    sequence: z.number().default(1),
    icon: z.string().default('BookOpen'),
    modules: z.array(moduleSchema).default([]),
    isPublished: z.boolean().default(true),
  }),
});

export const updateCurriculumSchema = z.object({
  body: createCurriculumSchema.shape.body.partial(),
});

export const getCurriculumQuerySchema = z.object({
  query: z.object({
    language: languageEnum.optional(),
    targetLevel: targetLevelEnum.optional(),
    category: categoryEnum.optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(50).default(10).optional(),
  }),
});
