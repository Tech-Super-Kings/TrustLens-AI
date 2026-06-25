import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { roleDashboardPaths, roleIcons, roleLabels, roles } from '../utils/roles';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-5 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 text-xl font-bold">
          <span className="rounded-lg bg-brand-600 p-2 text-white">
            <ShieldCheck className="h-6 w-6" />
          </span>
          TrustLens AI
        </div>
        <nav className="mt-8 space-y-2">
          {roles.map((role) => {
            const Icon = roleIcons[role];
            const isOwnRole = user?.role === role;

            return (
              <NavLink
                key={role}
                to={roleDashboardPaths[role]}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : isOwnRole
                        ? 'text-slate-800 hover:bg-brand-50 dark:text-slate-100 dark:hover:bg-slate-800'
                        : 'pointer-events-none text-slate-400 dark:text-slate-600'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {roleLabels[role]}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-950">
          <p className="font-semibold text-slate-900 dark:text-white">Verification readiness</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Phase 1 auth and dashboard shell are active for future modules.</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="rounded-lg border border-slate-200 p-2 dark:border-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 dark:border-slate-800 dark:bg-slate-900 md:flex">
              <Search className="h-4 w-4" />
              <span className="text-sm">Search credentials, issuers, audits...</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="relative rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-violet-500" />
              </button>
              <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user ? roleLabels[user.role] : ''}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
              <button onClick={handleLogout} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900" aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
