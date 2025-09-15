import mongoose, { Schema } from 'mongoose';

export enum WorkerType {
  HR = 'hr',
  WORKER = 'worker',
}

export enum StatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REMOTE = 'remote',
  ONVACATION = 'onvacation',
}

const CoordinateSchema = new Schema({
  type: {
    type: String,
    required: false
  },
  point: {
    type: [Number],
    required: false
  }
}, {_id: false})

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  dob?: Date;
  address: string;
  profile_img?: string;
  gender?: string;
  user_role: WorkerType;
  status: string;
  completedTasks: Array<mongoose.Types.ObjectId>;
  feedbacks: Array<mongoose.Types.ObjectId>;
  startedJobAt: Date; //Ажилд орсон огноо
  department: string; //Хэлтэс
  position: string; //Албан тушаал
  refresh_token: string;
  coordinates?: {
    type?: string;
    coordinates?: [Number];
  };
  managerName?: string;
  kpiRating?: number; //performance rating
  emotion: Date;
}
//username nemeh

const UserSchema: Schema<IUser> = new Schema({
  first_name: {
    type: String,
    required: [true, 'Enter the First Name'],
  },
  last_name: {
    type: String,
    required: [false, 'Enter the Last Name'],
  },
  email: {
    type: String,
    required: [true, 'Enter the Email Address'],
    unique: true,
  },
  phone_number: {
    type: Number,
    required: [false, 'Enter the phone number'],
    unique: true,
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
    required: [false, 'Please provide an Address!'],
  },
  profile_img: {
    type: String,
    required: [false, 'Please provide an Image!'],
  },
  gender: {
    type: String,
  },
  user_role: {
    type: String,
    enum: {
      values: Object.values(WorkerType),
      message: 'Role is either hr or worker',
    },
  },
  status: {
    type: String,
    default: 'active',
    enum: {
      values: Object.values(StatusType),
    },
  },
  completedTasks: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  feedbacks: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  startedJobAt: {
    type: Date,
    required: [false, 'Please provide the job start date!'],
  },
  department: {
    type: String,
    required: [false, 'Please provide the department!'],
  },
  position: {
    type: String,
    required: [false, 'Please provide the position!'],
  },
  refresh_token: {
    type: String,
  },
  coordinates: {
    type: CoordinateSchema,
    required: false,
  },
  managerName: {
    type: String,
    required: false,
  },
  kpiRating: Number,
  emotion: Date,
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
