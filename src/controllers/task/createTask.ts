import mongoose from 'mongoose';
import { TaskType, TaskModel } from '../../models/task.model';
import { NextFunction, Response } from 'express';
import { CreateTaskRequest, createResponse } from './helper';

//Шинэ task бүртгэх
export const createTask = async (
  req: CreateTaskRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      priority,
      type,
      createdBy,
      isActive,
      workingDays,
    } = req.body;

    console.log('Creating a task...', {
      title,
      description,
      priority,
      type,
      createdBy,
      isActive,
      workingDays,
    });

    const newTask = await TaskModel.create({
      title,
      description,
      priority,
      type: type || TaskType.NORMAL,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      isActive,
      workingDays,
    });

    res
      .status(200)
      .json(createResponse(true, 'Task амжилттай үүслээ', newTask));
  } catch (error) {
    console.error('Error creating task:', error);
    next(error);
  }
};
