import mongoose, { Schema } from 'mongoose';

type Emotion = {
  users: mongoose.Types.ObjectId[];
  emotionIndex: emotionIndex;
};
enum emotionIndex {
  HAPPY = 1,
  SAD = 2,
  resestment = 3,
  BORED = 4,
  ANGRY = 5,
  ANXIETY = 6,
  SHY = 7,
  ENVY = 8,
  SCARY = 9,
}

interface IHappyness {
  date: string;
  emotion: [Emotion];
  createdAt: Date;
  updatedAt: Date;
}

const EmotionSchema = new Schema<Emotion>({
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  emotionIndex: { type: Number, required: true },
});

const HappynessSchema = new Schema<IHappyness>(
  {
    date: { type: String, required: true },
    emotion: [{ type: EmotionSchema, required: true }],
  },
  { timestamps: true } // createdAt, updatedAt автоматаар нэмэгдэнэ
);

HappynessSchema.index({ createdAt: -1 });

export const HappynessModel = mongoose.model<IHappyness>(
  'Happyness',
  HappynessSchema
);

//moment().format('YYYY-MM-DD');
