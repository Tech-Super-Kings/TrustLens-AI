import { api } from './api';
import type { UserRole } from '../utils/roles';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthPayload & {
  name: string;
  role: UserRole;
  organization?: string;
  phone?: string;
};

type AuthResponse = {
  success: boolean;
  token: string;
  user: User;
};

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>('/register', payload);
    return data;
  },
  async login(payload: AuthPayload) {
    const { data } = await api.post<AuthResponse>('/login', payload);
    return data;
  },
  async profile() {
    const { data } = await api.get<{ success: boolean; user: User }>('/profile');
    return data.user;
  },
  async updateProfile(payload: Partial<User>) {
    const { data } = await api.put<{ success: boolean; user: User }>('/profile', payload);
    return data.user;
  },
  async logout() {
    await api.post('/logout');
  },
};
