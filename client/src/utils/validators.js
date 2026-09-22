import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    age: z
      .coerce
      .number({ invalid_type_error: 'Please enter your age' })
      .min(3, 'Age must be at least 3')
      .max(120, 'Please enter a valid age'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    preferredLanguage: z.string().default('te'),
    role: z.enum(['learner', 'educator']).default('learner'),
    targetSkills: z.array(z.string()).default(['reading', 'vocabulary', 'phonics']),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  preferredLanguage: z.string(),
  targetSkills: z.array(z.string()).min(1, 'Select at least one target skill'),
});
