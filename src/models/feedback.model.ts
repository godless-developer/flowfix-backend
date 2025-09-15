import mongoose, { Schema } from 'mongoose';

interface IFeedback {
  categoryId: [mongoose.Types.ObjectId];
  question: string;
  answer: string;
  userId: mongoose.Types.ObjectId;
  isSolved: boolean;
  unknown: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    categoryId: {
      type: [Schema.Types.ObjectId],
      ref: 'FeedbackCategory',
      required: [true, 'Feedback үүсгэсэн хэрэглэгчийн ID оруулна уу.'],
    },

    question: {
      type: String,
      required: [true, 'Feedback тайлбар оруулна уу.'],
    },
    answer: {
      type: String,
      required: [false, 'Feedback тайлбар оруулна уу.'],
    },
    isSolved: {
      type: Boolean,
      required: [true, 'Feedback идэвхтэй эсэхийг оруулна уу.'],
      default: false,
    },
    unknown: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Feedback үүсгэсэн хэрэглэгчийн ID оруулна уу.'],
    },
  },
  { timestamps: true }
);

FeedbackSchema.index({ isSolved: 1 });
FeedbackSchema.index({ createdAt: -1 });

export const FeedbackModel = mongoose.model<IFeedback>(
  'Feedback',
  FeedbackSchema
);
