import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileCheck2, FileSearch, History, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { MetricCard } from '../components/MetricCard';
import { Skeleton } from '../components/Skeleton';
import { StatusBadge } from '../components/StatusBadge';
import { certificateService, type Certificate } from '../services/certificate.service';

export const CredentialAnalysisPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setIsLoading(true);
        const result = await certificateService.list({ search, status });
        setCertificates(result);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load certificates');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = window.setTimeout(loadCertificates, 250);
    return () => window.clearTimeout(timeoutId);
  }, [search, status]);

  const metrics = useMemo(
    () => ({
      total: certificates.length,
      authentic: certificates.filter((certificate) => certificate.riskLevel === 'Low').length,
      suspicious: certificates.filter((certificate) => certificate.riskLevel === 'High' || certificate.riskLevel === 'Medium').length,
      pending: certificates.filter((certificate) => certificate.verificationStatus === 'Uploaded' || certificate.verificationStatus === 'Pending Review').length,
    }),
    [certificates],
  );

  const analyzeCertificate = async (certificateId: string) => {
    const loadingToast = toast.loading('Analyzing credential...');
    try {
      const analyzed = await certificateService.analyze(certificateId);
      setCertificates((current) => current.map((certificate) => (certificate._id === analyzed._id ? analyzed : certificate)));
      toast.success('Analysis completed', { id: loadingToast });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analysis failed', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-brand-100">Credential Intelligence</p>
        <h1 className="mt-2 text-3xl font-bold">Credential Analysis Dashboard</h1>
        <p className="mt-3 text-slate-300">Track uploads, AI reports, review status, and verification readiness.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Uploads" value={metrics.total} icon={FileSearch} />
        <MetricCard title="Authentic" value={metrics.authentic} icon={ShieldCheck} tone="green" />
        <MetricCard title="Suspicious" value={metrics.suspicious} icon={AlertTriangle} tone="amber" />
        <MetricCard title="Pending Review" value={metrics.pending} icon={History} tone="purple" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
            <Search className="h-5 w-5 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate, certificate ID, institution..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input-field">
            <option value="">All statuses</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Analyzed">Analyzed</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Link to="/credentials/upload" className="primary-button">
            Upload Credential
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-xl font-bold">Recent Uploads & Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Candidate</th>
                <th className="px-5 py-4">Institution</th>
                <th className="px-5 py-4">Certificate ID</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Risk</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="border-t border-slate-100 dark:border-slate-800">
                    <td colSpan={7} className="px-5 py-4">
                      <Skeleton className="h-8" />
                    </td>
                  </tr>
                ))}
              {!isLoading &&
                certificates.map((certificate) => (
                  <tr key={certificate._id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-5 py-4 font-semibold">{certificate.extractedData.candidateName ?? 'Pending OCR'}</td>
                    <td className="px-5 py-4">{certificate.extractedData.institutionName ?? '-'}</td>
                    <td className="px-5 py-4">{certificate.extractedData.certificateNumber ?? certificate._id.slice(-8)}</td>
                    <td className="px-5 py-4">{new Date(certificate.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><StatusBadge value={certificate.riskLevel} /></td>
                    <td className="px-5 py-4"><StatusBadge value={certificate.verificationStatus} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {certificate.verificationStatus === 'Uploaded' && (
                          <button onClick={() => void analyzeCertificate(certificate._id)} className="secondary-button px-3 py-2">
                            Analyze
                          </button>
                        )}
                        <Link to={`/credentials/report/${certificate._id}`} className="primary-button px-3 py-2">
                          <FileCheck2 className="h-4 w-4" />
                          Report
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              {!isLoading && certificates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No credentials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
