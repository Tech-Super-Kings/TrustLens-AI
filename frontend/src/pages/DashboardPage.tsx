import { Award, BarChart3, BellRing, CheckCircle2, Clock, FileCheck2, ShieldAlert, UsersRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { roleIcons, roleLabels, type UserRole } from '../utils/roles';

const dashboardCopy: Record<UserRole, { title: string; subtitle: string; actions: string[] }> = {
  student: {
    title: 'Student Credential Vault',
    subtitle: 'Manage academic credentials, proof requests, and AI-readiness checks.',
    actions: ['Upload credential', 'Share verification link', 'Track employer requests'],
  },
  employer: {
    title: 'Employer Verification Desk',
    subtitle: 'Review applicant credentials and prepare trusted hiring decisions.',
    actions: ['Request verification', 'Review risk signals', 'Export hiring report'],
  },
  university: {
    title: 'University Issuer Console',
    subtitle: 'Prepare institution-issued credentials and verification workflows.',
    actions: ['Issue credential', 'Validate student record', 'Monitor requests'],
  },
  government: {
    title: 'Government Oversight Hub',
    subtitle: 'Observe trust signals, suspicious credentials, and compliance trends.',
    actions: ['Review agencies', 'Audit credential network', 'Flag anomalies'],
  },
  admin: {
    title: 'TrustLens Admin Command',
    subtitle: 'Manage roles, platform health, and verification infrastructure.',
    actions: ['Manage users', 'Configure trust rules', 'Review system logs'],
  },
};

export const DashboardPage = ({ role }: { role: UserRole }) => {
  const { user } = useAuth();
  const Icon = roleIcons[role];
  const copy = dashboardCopy[role];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-100">
              <Icon className="h-4 w-4" />
              {roleLabels[role]} Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-300">{copy.subtitle}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Signed in as</p>
            <p className="mt-1 text-xl font-bold">{user?.name}</p>
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Verified', '128', CheckCircle2],
          ['Pending', '24', Clock],
          ['Risk flags', '3', ShieldAlert],
          ['Requests', '76', BellRing],
        ].map(([label, value, StatIcon]) => (
          <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">{label as string}</p>
              <StatIcon className="h-5 w-5 text-brand-600" />
            </div>
            <p className="mt-4 text-3xl font-bold">{value as string}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Priority actions</h2>
            <FileCheck2 className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 space-y-3">
            {copy.actions.map((action) => (
              <button key={action} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-4 text-left font-semibold transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-800 dark:hover:border-brand-500 dark:hover:bg-slate-800">
                {action}
                <Award className="h-5 w-5 text-violet-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Trust activity</h2>
            <BarChart3 className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 space-y-4">
            {['Credential scan completed', 'Blockchain proof queued', 'Profile verification updated'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                <UsersRound className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-semibold">{item}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
