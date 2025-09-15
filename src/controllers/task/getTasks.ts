import { TaskQuery, createResponse } from './helper';
import { TaskType, TaskModel } from '../../models/task.model';
import { NextFunction, Response } from 'express';

//Task-н type-аар, байхгүй бол бүх active (true) taskууд авах,
export const getTasks = async (
  req: TaskQuery,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const filter: any = {};
  const sortObj: any = { priority: 1, createdAt: -1 }; // priority-ээр өсөхөөр, priority ижил бол createdAt-ээр буурахаар эрэмбэлнэ
  try {
    const { type } = req.body;
    if (type && Object.values(TaskType).includes(type)) {
      filter.type = type;
    }
    filter.isActive = true;
    const [tasks] = await Promise.all([
      TaskModel.find(filter).sort(sortObj).lean(),
    ]);
    res.status(200).json(createResponse(true, 'Tasks: ', tasks));
  } catch (error) {
    console.error('Error getting task list: ', error);
    next(error);
  }
};
