import { z } from 'zod';

const languageEnum = z.enum(['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr']);
const roleEnum = z.enum(['learner', 'educator', 'admin']);
const proficiencyEnum = z.enum(['unassessed', 'beginner', 'elementary', 'intermediate', 'advanced']);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    preferredLanguage: languageEnum.default('en'),
    role: roleEnum.default('learner'),
    targetSkills: z.array(z.string()).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    preferredLanguage: languageEnum.optional(),
    targetSkills: z.array(z.string()).optional(),
    avatar: z.string().url().optional(),
    proficiencyLevel: proficiencyEnum.optional(),
  }),
});
