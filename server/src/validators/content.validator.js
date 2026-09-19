import { z } from 'zod';

const languageEnum = z.enum(['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr']);
const difficultyEnum = z.enum(['beginner', 'elementary', 'intermediate', 'advanced']);
const contentTypeEnum = z.enum([
  'letter_phonics',
  'sight_words',
  'sentence_builder',
  'short_story',
  'dialogue',
  'functional_text',
]);

const vocabularySchema = z.object({
  word: z.string().min(1),
  meaning: z.string().min(1),
  phonetics: z.string().optional(),
  exampleSentence: z.string().optional(),
  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

const translationSchema = z.object({
  language: languageEnum,
  translatedTitle: z.string().min(1),
  translatedText: z.string().min(1),
  phoneticGuide: z.string().optional(),
});

const questionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
});

export const createContentSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    language: languageEnum,
    difficultyLevel: difficultyEnum.default('beginner'),
    contentType: contentTypeEnum.default('short_story'),
    textContent: z.string().min(1),
    phoneticGuide: z.string().optional(),
    summary: z.string().optional(),
    audioUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    translations: z.array(translationSchema).optional(),
    vocabulary: z.array(vocabularySchema).optional(),
    comprehensionQuestions: z.array(questionSchema).optional(),
    tags: z.array(z.string()).optional(),
    estimatedReadTimeMinutes: z.number().min(1).default(3),
    isPublished: z.boolean().default(true),
  }),
});

export const updateContentSchema = z.object({
  body: createContentSchema.shape.body.partial(),
});

export const getContentQuerySchema = z.object({
  query: z.object({
    language: languageEnum.optional(),
    difficultyLevel: difficultyEnum.optional(),
    contentType: contentTypeEnum.optional(),
    search: z.string().optional(),
    tag: z.string().optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(50).default(12).optional(),
  }),
});
