import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authService, type AuthPayload, type RegisterPayload, type User } from '../services/auth.service';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AuthPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('trustlens_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('trustlens_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem('trustlens_token')) {
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authService.profile();
      setUser(profile);
    } catch {
      localStorage.removeItem('trustlens_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const login = async (payload: AuthPayload) => {
    const data = await authService.login(payload);
    persistSession(data.token, data.user);
    toast.success('Welcome back to TrustLens AI');
    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    persistSession(data.token, data.user);
    toast.success('Account created successfully');
    return data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Token cleanup is local and should always happen.
    } finally {
      localStorage.removeItem('trustlens_token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
