import type { LucideIcon } from 'lucide-react';

export const MetricCard = ({ title, value, icon: Icon, tone = 'blue' }: { title: string; value: string | number; icon: LucideIcon; tone?: 'blue' | 'green' | 'amber' | 'purple' }) => {
  const tones = {
    blue: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
    purple: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <span className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
};
