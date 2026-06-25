import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Blocks, BrainCircuit, Fingerprint, LockKeyhole, Network, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  { title: 'AI credential intelligence', description: 'Analyze credential metadata, issuer trust, and verification risk signals.', icon: BrainCircuit },
  { title: 'Blockchain verification', description: 'Prepare tamper-resistant credential proofs for future immutable audit trails.', icon: Blocks },
  { title: 'Role-based workflows', description: 'Separate experiences for students, employers, universities, agencies, and admins.', icon: Fingerprint },
];

const steps = ['Create a secure account', 'Submit or request credentials', 'Verify with AI-assisted checks', 'Anchor trust evidence on-chain'];
const benefits = ['Reduce hiring fraud', 'Improve institutional compliance', 'Accelerate verification workflows', 'Build portable digital trust'];
const stack = ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Mongoose', 'Blockchain-ready'];

export const LandingPage = () => (
  <>
    <main className="overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_top_right,#ede9fe,transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(47,125,246,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm dark:border-brand-500/20 dark:bg-slate-900 dark:text-brand-100">
              <Sparkles className="h-4 w-4" />
              Verify Credentials with AI + Blockchain
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
                TrustLens AI
              </h1>
              <p className="max-w-2xl text-xl font-medium text-slate-700 dark:text-slate-200">
                AI-powered credential intelligence and blockchain verification platform for trusted education, employment, and governance ecosystems.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="primary-button">
                Start verifying <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="secondary-button">
                Access dashboard
              </Link>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-4 pt-4">
              {['5 roles', 'JWT auth', 'MongoDB'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white/70 p-4 text-center text-sm font-semibold dark:border-slate-800 dark:bg-slate-900/70">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="glass-panel rounded-2xl p-5">
            <div className="rounded-xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Credential Trust Score</p>
                  <p className="mt-1 text-4xl font-bold">97.8%</p>
                </div>
                <ShieldCheck className="h-12 w-12 text-brand-100" />
              </div>
              <div className="mt-8 space-y-4">
                {['Issuer authenticity', 'Identity consistency', 'Blockchain proof readiness'].map((label, index) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{label}</span>
                      <span>{96 + index}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${92 + index * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-bold">2.4s</p>
                  <p className="text-sm text-slate-300">AI pre-check</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-300">Critical flags</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article whileHover={{ y: -6 }} key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">{feature.title}</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-semibold text-brand-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A verification pipeline built for real trust decisions.</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">{index + 1}</span>
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-xl bg-slate-950 p-8 text-white">
          <Network className="h-10 w-10 text-brand-100" />
          <h2 className="mt-5 text-3xl font-bold">Benefits for every trust stakeholder</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-lg bg-white/10 p-4">
                <BadgeCheck className="h-5 w-5 text-brand-100" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <LockKeyhole className="h-10 w-10 text-violet-500" />
          <h2 className="mt-5 text-3xl font-bold">Technology stack</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {stack.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
      TrustLens AI - Credential intelligence foundation ready for Phase 2.
    </footer>
  </>
);
