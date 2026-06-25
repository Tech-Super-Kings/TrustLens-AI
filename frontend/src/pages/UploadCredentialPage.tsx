import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FileUp, Loader2, ShieldCheck, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { certificateService, type Certificate } from '../services/certificate.service';

const maxSize = 10 * 1024 * 1024;
const accepted = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

export const UploadCredentialPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCertificate, setUploadedCertificate] = useState<Certificate | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected) {
      return;
    }

    setFile(selected);
    setUploadedCertificate(null);
    setPreviewUrl(URL.createObjectURL(selected));
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accepted,
    maxSize,
    multiple: false,
  });

  const rejectionMessage = useMemo(() => fileRejections[0]?.errors[0]?.message, [fileRejections]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Choose a certificate first');
      return;
    }

    try {
      setIsUploading(true);
      const certificate = await certificateService.upload(file, setProgress);
      setUploadedCertificate(certificate);
      toast.success('Certificate uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedCertificate) {
      return;
    }

    const loadingToast = toast.loading('Running OCR and AI analysis...');
    try {
      const analyzed = await certificateService.analyze(uploadedCertificate._id);
      toast.success('Analysis completed', { id: loadingToast });
      navigate(`/credentials/report/${analyzed._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analysis failed', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-brand-100">Certificate Upload</p>
        <h1 className="mt-2 text-3xl font-bold">Upload Credential for AI Analysis</h1>
        <p className="mt-3 max-w-2xl text-slate-300">PDF, PNG, JPG, and JPEG files up to 10 MB are supported. Blockchain registration remains pending for Phase 3.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div
            {...getRootProps()}
            className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
              isDragActive ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-300 hover:border-brand-400 dark:border-slate-700'
            }`}
          >
            <input {...getInputProps()} />
            <FileUp className="h-12 w-12 text-brand-600" />
            <h2 className="mt-5 text-xl font-bold">Drag and drop certificate</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">or click to browse files</p>
            <p className="mt-4 text-xs font-semibold text-slate-400">PDF, PNG, JPG, JPEG - Max 10 MB</p>
          </div>
          {rejectionMessage && <p className="mt-3 text-sm text-red-500">{rejectionMessage}</p>}
          {file && (
            <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800" aria-label="Remove file">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {isUploading && (
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{progress}% uploaded</p>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleUpload} disabled={!file || isUploading} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
              Upload
            </button>
            <button onClick={handleAnalyze} disabled={!uploadedCertificate} className="secondary-button disabled:cursor-not-allowed disabled:opacity-60">
              <ShieldCheck className="h-4 w-4" />
              Analyze now
            </button>
          </div>
        </motion.section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold">Document preview</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            {!previewUrl && <div className="flex h-96 items-center justify-center text-slate-500">Preview appears here after selecting a file.</div>}
            {previewUrl && file?.type === 'application/pdf' && <iframe src={previewUrl} title="Certificate preview" className="h-96 w-full" />}
            {previewUrl && file?.type !== 'application/pdf' && <img src={previewUrl} alt="Certificate preview" className="h-96 w-full object-contain" />}
          </div>
        </section>
      </div>
    </div>
  );
};
