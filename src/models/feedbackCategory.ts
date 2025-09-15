import mongoose, { Schema } from 'mongoose';

interface IFeedbackCategory {
  categoryName: string;
}

const FeedbackCategorySchema: Schema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const FeedbackCategoryModel = mongoose.model<IFeedbackCategory>(
  'FeedbackCategory',
  FeedbackCategorySchema
);
