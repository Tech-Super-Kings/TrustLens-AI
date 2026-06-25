import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarClock, FileText, ShieldCheck } from 'lucide-react';
import { CertificatePreview } from '../components/CertificatePreview';
import { Skeleton } from '../components/Skeleton';
import { StatusBadge } from '../components/StatusBadge';
import { certificateService, type Certificate } from '../services/certificate.service';

const fieldLabels: Record<string, string> = {
  candidateName: 'Candidate Name',
  institutionName: 'Institution Name',
  degree: 'Degree',
  department: 'Department',
  registrationNumber: 'Registration Number',
  certificateNumber: 'Certificate Number',
  issueDate: 'Issue Date',
  graduationYear: 'Graduation Year',
  cgpaOrGrade: 'CGPA / Grade',
  signaturePresence: 'Signature Presence',
  sealPresence: 'Seal Presence',
};

export const VerificationReportPage = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        return;
      }

      try {
        setCertificate(await certificateService.get(id));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load report');
      } finally {
        setIsLoading(false);
      }
    };

    void loadReport();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!certificate) {
    return <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">Report not found.</div>;
  }

  const extractedEntries = Object.entries(certificate.extractedData).filter(([key]) => key !== 'rawText');

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-100">Verification Report</p>
            <h1 className="mt-2 text-3xl font-bold">{certificate.extractedData.candidateName ?? certificate.originalName}</h1>
            <p className="mt-3 text-slate-300">Verification ID: {certificate._id}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-slate-300">Authenticity</p>
              <p className="text-2xl font-bold">{certificate.authenticityScore ?? 0}%</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-slate-300">Confidence</p>
              <p className="text-2xl font-bold">{certificate.confidenceScore ?? 0}%</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-slate-300">Risk</p>
              <div className="mt-2"><StatusBadge value={certificate.riskLevel} /></div>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-slate-300">Status</p>
              <div className="mt-2"><StatusBadge value={certificate.verificationStatus} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <CertificatePreview certificate={certificate} />
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-xl font-bold"><CalendarClock className="h-5 w-5 text-brand-600" /> Report Metadata</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="font-semibold">Timestamp:</span> {new Date(certificate.updatedAt).toLocaleString()}</p>
              <p><span className="font-semibold">Blockchain:</span> {certificate.blockchainStatus}</p>
              <p><span className="font-semibold">Original File:</span> {certificate.originalName}</p>
              <p><span className="font-semibold">File Type:</span> {certificate.fileType}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-xl font-bold"><FileText className="h-5 w-5 text-brand-600" /> Extracted Fields</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {extractedEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-xs font-bold uppercase text-slate-500">{fieldLabels[key] ?? key}</p>
                  <p className="mt-1 font-semibold">{typeof value === 'boolean' ? (value ? 'Detected' : 'Not Detected') : value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-5 w-5 text-brand-600" /> Explainable AI Summary</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{certificate.aiSummary ?? 'Analysis has not been run yet.'}</p>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="font-bold">Detected Issues</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(certificate.issues.length ? certificate.issues : ['No issues recorded.']).map((issue) => <li key={issue}>- {issue}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(certificate.recommendations.length ? certificate.recommendations : ['Run AI analysis to generate recommendations.']).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <Link to="/credentials/analysis" className="secondary-button">Back to analysis dashboard</Link>
        </div>
      </section>
    </div>
  );
};
