import mongoose, { Schema, type Document, type Types } from 'mongoose';

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

export interface ICertificate extends Document {
  userId: Types.ObjectId;
  fileName: string;
  originalName: string;
  filePath: string;
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
  uploadedAt: Date;
}

const extractedDataSchema = new Schema<ExtractedData>(
  {
    candidateName: String,
    institutionName: String,
    degree: String,
    department: String,
    registrationNumber: String,
    certificateNumber: String,
    issueDate: String,
    graduationYear: String,
    cgpaOrGrade: String,
    signaturePresence: Boolean,
    sealPresence: Boolean,
    rawText: String,
  },
  { _id: false },
);

const certificateSchema = new Schema<ICertificate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedData: {
      type: extractedDataSchema,
      default: {},
    },
    authenticityScore: Number,
    confidenceScore: Number,
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    aiSummary: String,
    issues: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    tamperingFindings: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ['Uploaded', 'Analyzed', 'Pending Review', 'Rejected'],
      default: 'Uploaded',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

certificateSchema.index({ 'extractedData.candidateName': 'text', 'extractedData.institutionName': 'text', 'extractedData.certificateNumber': 'text' });

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
