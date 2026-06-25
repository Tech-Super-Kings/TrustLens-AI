import { FileWarning, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Certificate } from '../services/certificate.service';

export const CertificatePreview = ({ certificate }: { certificate: Certificate }) => {
  const isPdf = certificate.fileType === 'application/pdf';
  const [hasError, setHasError] = useState(false);

  if (!certificate.previewUrl || hasError) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-950">
        <FileWarning className="h-10 w-10 text-amber-500" />
        <h3 className="mt-4 text-lg font-bold">Preview unavailable</h3>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          The uploaded file could not be displayed inline. Open the source file in a new tab to inspect it.
        </p>
        {certificate.previewUrl && (
          <a href={certificate.previewUrl} target="_blank" rel="noreferrer" className="secondary-button mt-5">
            <ExternalLink className="h-4 w-4" />
            Open file
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {isPdf ? (
        <iframe src={certificate.previewUrl} title={certificate.originalName} className="h-[520px] w-full" onError={() => setHasError(true)} />
      ) : (
        <img src={certificate.previewUrl} alt={certificate.originalName} className="max-h-[520px] w-full object-contain" onError={() => setHasError(true)} />
      )}
    </div>
  );
};
