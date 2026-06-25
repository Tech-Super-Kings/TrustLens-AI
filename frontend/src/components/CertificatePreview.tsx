import type { Certificate } from '../services/certificate.service';

export const CertificatePreview = ({ certificate }: { certificate: Certificate }) => {
  const isPdf = certificate.fileType === 'application/pdf';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {isPdf ? (
        <iframe src={certificate.previewUrl} title={certificate.originalName} className="h-[520px] w-full" />
      ) : (
        <img src={certificate.previewUrl} alt={certificate.originalName} className="max-h-[520px] w-full object-contain" />
      )}
    </div>
  );
};
