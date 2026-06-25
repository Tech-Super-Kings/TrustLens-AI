import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import { StatusBadge } from '../components/StatusBadge';
import { certificateService, type AnalysisHistory, type Certificate } from '../services/certificate.service';

const isCertificate = (value: AnalysisHistory['certificateId']): value is Certificate => typeof value === 'object' && value !== null && '_id' in value;

export const CredentialHistoryPage = () => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistory(await certificateService.history());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load history');
      } finally {
        setIsLoading(false);
      }
    };

    void loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-100"><History className="h-4 w-4" /> Analysis History</p>
        <h1 className="mt-2 text-3xl font-bold">Credential Verification History</h1>
        <p className="mt-3 text-slate-300">Audit trail for OCR extraction, AI analysis, and report generation.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Certificate</th>
                <th className="px-5 py-4">Analysis Type</th>
                <th className="px-5 py-4">Risk</th>
                <th className="px-5 py-4">Processing</th>
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Report</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}><td colSpan={6} className="px-5 py-4"><Skeleton className="h-8" /></td></tr>
                ))}
              {!isLoading &&
                history.map((item) => {
                  const certificate = isCertificate(item.certificateId) ? item.certificateId : null;
                  return (
                    <tr key={item._id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-5 py-4 font-semibold">{certificate?.originalName ?? 'Certificate'}</td>
                      <td className="px-5 py-4">{item.analysisType}</td>
                      <td className="px-5 py-4"><StatusBadge value={certificate?.riskLevel} /></td>
                      <td className="px-5 py-4">{item.processingTime} ms</td>
                      <td className="px-5 py-4">{new Date(item.timestamp).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        {certificate && <Link to={`/credentials/report/${certificate._id}`} className="primary-button px-3 py-2">Open</Link>}
                      </td>
                    </tr>
                  );
                })}
              {!isLoading && history.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No analysis history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
