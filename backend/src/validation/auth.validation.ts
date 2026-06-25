import { z } from 'zod';
import { userRoles } from '../models/User.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(userRoles),
    organization: z.string().trim().max(120).optional().or(z.literal('')),
    phone: z.string().trim().max(24).optional().or(z.literal('')),
    profileImage: z.string().trim().url().optional().or(z.literal('')),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    organization: z.string().trim().max(120).optional().or(z.literal('')),
    phone: z.string().trim().max(24).optional().or(z.literal('')),
    profileImage: z.string().trim().url().optional().or(z.literal('')),
  }),
});
