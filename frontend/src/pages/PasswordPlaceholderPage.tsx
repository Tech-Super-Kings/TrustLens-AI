import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

export const PasswordPlaceholderPage = ({ mode }: { mode: 'forgot' | 'reset' }) => (
  <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
      <MailCheck className="h-7 w-7" />
    </div>
    <h1 className="mt-6 text-3xl font-bold">{mode === 'forgot' ? 'Forgot password' : 'Reset password'}</h1>
    <p className="mt-3 text-slate-500 dark:text-slate-400">
      This workflow is reserved for the production email module. The UI route is ready and will be connected in a later phase.
    </p>
    <Link to="/login" className="primary-button mt-8 w-full">
      Back to login
    </Link>
  </div>
);
