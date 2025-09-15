import mongoose, { Schema } from 'mongoose';

export enum TaskType {
  ONBOARDING = 'onboarding',
  URGENT = 'urgent',
  NORMAL = 'normal',
  PROBATION = 'probation',
}

interface ITask {
  title: string;
  priority: number;
  description: string;
  type: TaskType;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  workingDays: number;
}

const TaskSchema: Schema<ITask> = new Schema({
  title: {
    type: String,
    required: [true, 'Task нэр оруулна уу.'],
    maxLength: [50, 'Нэр хамгийн ихдээ 50 үгтэй байна.'],
  },
  priority: {
    type: Number,
    required: [false, 'Task priority оруулна уу.'],
    min: [1, 'Priority хамгийн багадаа 1 байна.'],
  },
  description: {
    type: String,
    required: [true, 'Task тайлбар оруулна уу.'],
    maxLength: [100, 'Тайлбайр хамгийн ихдээ 100 үгтэй байна.'],
  },
  type: {
    type: String,
    enum: {
      values: Object.values(TaskType),
      message: 'Task төрөл onboarding, urgent, normal-н аль нэг нь байна.',
    },
    required: [true, 'Task төрөл оруулна уу.'],
  },
  isActive: {
    type: Boolean,
    required: [true, 'Таск идэвхтэй эсэхийг оруулна уу.'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task үүсгэсэн хэрэглэгчийн ID оруулна уу.'],
  },
  workingDays: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.index({ createdBy: 1, isActive: 1 });
TaskSchema.index({ priority: -1 });
TaskSchema.index({ type: 1 });
TaskSchema.index({ createdAt: -1 });

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
