import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.string().default('en'),
  role: z.enum(['learner', 'educator']).default('learner'),
  targetSkills: z.array(z.string()).min(1, 'Select at least one target skill'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  preferredLanguage: z.string(),
  targetSkills: z.array(z.string()).min(1, 'Select at least one target skill'),
});
