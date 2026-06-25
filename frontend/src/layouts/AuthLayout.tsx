import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const AuthLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
    <div className="absolute right-6 top-6">
      <ThemeToggle />
    </div>
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-xl font-bold">
          <span className="rounded-lg bg-brand-600 p-2">
            <ShieldCheck className="h-6 w-6" />
          </span>
          TrustLens AI
        </div>
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-100">AI + Blockchain Verification</p>
          <h1 className="max-w-xl text-5xl font-bold leading-tight">Credential trust infrastructure for institutions, employers, and public agencies.</h1>
          <p className="max-w-lg text-lg text-slate-300">
            Securely onboard users, verify identities, and prepare credential intelligence workflows for the next phase.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">Role-aware access</div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">JWT security</div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">MongoDB-ready</div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-20 sm:px-6">
        <Outlet />
      </section>
    </main>
  </div>
);
