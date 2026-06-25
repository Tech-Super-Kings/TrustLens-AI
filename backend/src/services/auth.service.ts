import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/jwt.js';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'employer' | 'university' | 'government' | 'admin';
  organization?: string;
  phone?: string;
  profileImage?: string;
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create(input);
  const token = signToken({ userId: user.id, role: user.role });

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id, role: user.role });
  const safeUser = await User.findById(user.id);

  return { user: safeUser, token };
};
