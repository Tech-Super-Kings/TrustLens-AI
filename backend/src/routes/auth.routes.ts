import { Router } from 'express';
import { getProfile, login, logout, register, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema, updateProfileSchema } from '../validation/auth.validation.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.get('/profile', authenticate, getProfile);
authRouter.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
authRouter.post('/logout', authenticate, logout);
