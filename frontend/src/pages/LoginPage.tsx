import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthPayload } from '../services/auth.service';
import { roleDashboardPaths } from '../utils/roles';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthPayload>();

  const onSubmit = async (values: AuthPayload) => {
    try {
      const user = await login(values);
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      navigate(from ?? roleDashboardPaths[user.role], { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-sm font-semibold text-brand-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold">Sign in to TrustLens AI</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Continue to your role-specific verification dashboard.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input-field" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input-field" type="password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">Forgot password?</Link>
        </div>
        <button className="primary-button w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link>
      </p>
    </div>
  );
};
