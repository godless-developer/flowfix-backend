import mongoose, { Schema } from 'mongoose';

type Topic = {
  fileName: string;
  amount: number;
};
interface ITotalQuestion {
  amount: number;
  fileId: string;
  topics: [Topic];
}
const TopicSchema = new Schema<Topic>({
  fileName: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, default: 1 },
});

const TotalQuestionSchema = new Schema<ITotalQuestion>(
  {
    amount: { type: Number, required: true, default: 0 },
    fileId: { type: String },
    topics: [{ type: TopicSchema, required: true }],
  },
  { timestamps: true }
);

TotalQuestionSchema.index({ createdAt: -1 });

export const TotalQuestionModel = mongoose.model<ITotalQuestion>(
  'TotalQuestion',
  TotalQuestionSchema
);

//topic?
