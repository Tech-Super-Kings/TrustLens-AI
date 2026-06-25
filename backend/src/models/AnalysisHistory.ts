import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IAnalysisHistory extends Document {
  certificateId: Types.ObjectId;
  analysisType: string;
  timestamp: Date;
  aiResponse: unknown;
  processingTime: number;
}

const analysisHistorySchema = new Schema<IAnalysisHistory>(
  {
    certificateId: {
      type: Schema.Types.ObjectId,
      ref: 'Certificate',
      required: true,
      index: true,
    },
    analysisType: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    aiResponse: {
      type: Schema.Types.Mixed,
      required: true,
    },
    processingTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const AnalysisHistory = mongoose.model<IAnalysisHistory>('AnalysisHistory', analysisHistorySchema);
