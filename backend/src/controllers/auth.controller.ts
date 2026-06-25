import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const authResponse = (res: Response, statusCode: number, data: Record<string, unknown>) => {
  res.status(statusCode).json({
    success: true,
    ...data,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await registerUser(req.body);
  authResponse(res, 201, { token, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);
  authResponse(res, 200, { token, user });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  authResponse(res, 200, { user: req.user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  authResponse(res, 200, { user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  authResponse(res, 200, { message: 'Logged out successfully' });
});
