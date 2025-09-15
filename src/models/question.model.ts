import mongoose, { Schema } from 'mongoose';

enum OriginType {
  AI = 'ai',
  USER = 'user',
}
interface IQuestion {
  question_text: string;
  answer_text: string;
  isSolved: string;
  origin: OriginType;
  score: number;
  existing_files: [string];
}

const QuestionSchema: Schema = new Schema(
  {
    question_text: {
      type: String,
      required: [true, 'Enter the question text'],
    },
    answer_text: {
      type: String,
      required: [false, 'Enter the answer text'],
    },
    isSolved: {
      type: Boolean,
      required: [true, 'Enter the isSolved value'],
      default: false,
    },
    origin: {
      type: String,
      required: [true, 'Enter the question origin'],
      default: 'ai',
    },
    score: {
      type: Number,
      required: [true, 'Please provide an score!'],
    },
    existing_files: [{ type: String, required: false }],
  },
  { timestamps: true }
);

export const QuestionModel = mongoose.model<IQuestion>(
  'Question',
  QuestionSchema
);
