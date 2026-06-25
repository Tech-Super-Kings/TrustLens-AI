import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="rounded-lg bg-brand-600 p-2 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          TrustLens AI
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="secondary-button hidden sm:inline-flex">
            Sign in
          </Link>
          <Link to="/register" className="primary-button">
            Get started
          </Link>
        </div>
      </nav>
    </header>
    <Outlet />
  </div>
);
