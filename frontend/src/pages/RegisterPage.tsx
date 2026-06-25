import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterPayload } from '../services/auth.service';
import { roleDashboardPaths, roleLabels, roles } from '../utils/roles';

export const RegisterPage = () => {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({ defaultValues: { role: 'student' } });

  const onSubmit = async (values: RegisterPayload) => {
    try {
      const user = await createAccount(values);
      navigate(roleDashboardPaths[user.role], { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-brand-600">Create secure identity</p>
      <h1 className="mt-2 text-3xl font-bold">Join TrustLens AI</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input-field" {...register('name', { required: 'Name is required', minLength: 2 })} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input-field" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input-field" type="password" {...register('password', { required: 'Password is required', minLength: 8 })} />
          {errors.password && <p className="text-sm text-red-500">Use at least 8 characters.</p>}
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="role">Role</label>
          <select id="role" className="input-field" {...register('role', { required: true })}>
            {roles.map((role) => (
              <option key={role} value={role}>{roleLabels[role]}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="organization">Organization</label>
          <input id="organization" className="input-field" {...register('organization')} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" className="input-field" {...register('phone')} />
        </div>
        <button className="primary-button sm:col-span-2" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link>
      </p>
    </div>
  );
};
