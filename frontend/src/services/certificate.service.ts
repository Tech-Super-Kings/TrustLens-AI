import { api } from './api';

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type VerificationStatus = 'Uploaded' | 'Analyzed' | 'Pending Review' | 'Rejected';

export type ExtractedData = {
  candidateName?: string;
  institutionName?: string;
  degree?: string;
  department?: string;
  registrationNumber?: string;
  certificateNumber?: string;
  issueDate?: string;
  graduationYear?: string;
  cgpaOrGrade?: string;
  signaturePresence?: boolean;
  sealPresence?: boolean;
  rawText?: string;
};

export type Certificate = {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  extractedData: ExtractedData;
  authenticityScore?: number;
  confidenceScore?: number;
  riskLevel?: RiskLevel;
  aiSummary?: string;
  issues: string[];
  recommendations: string[];
  tamperingFindings: string[];
  verificationStatus: VerificationStatus;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  previewUrl: string;
  blockchainStatus: string;
};

export type AnalysisHistory = {
  _id: string;
  certificateId: Certificate | string;
  analysisType: string;
  timestamp: string;
  aiResponse: unknown;
  processingTime: number;
};

const apiOrigin = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const withPreviewUrl = (certificate: Certificate): Certificate => ({
  ...certificate,
  previewUrl: certificate.previewUrl.startsWith('http') ? certificate.previewUrl : `${apiOrigin}${certificate.previewUrl}`,
});

export const certificateService = {
  async upload(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('certificate', file);

    const { data } = await api.post<{ success: boolean; certificate: Certificate }>('/certificate/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });

    return withPreviewUrl(data.certificate);
  },
  async analyze(certificateId: string) {
    const { data } = await api.post<{ success: boolean; certificate: Certificate }>('/certificate/analyze', { certificateId });
    return withPreviewUrl(data.certificate);
  },
  async list(params?: { search?: string; status?: string }) {
    const { data } = await api.get<{ success: boolean; certificates: Certificate[] }>('/certificate', { params });
    return data.certificates.map(withPreviewUrl);
  },
  async get(id: string) {
    const { data } = await api.get<{ success: boolean; certificate: Certificate }>(`/certificate/${id}`);
    return withPreviewUrl(data.certificate);
  },
  async history() {
    const { data } = await api.get<{ success: boolean; history: AnalysisHistory[] }>('/certificate/history');
    return data.history;
  },
  async remove(id: string) {
    await api.delete(`/certificate/${id}`);
  },
};
