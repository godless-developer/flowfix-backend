import { NextFunction, Response } from 'express';
import { CompleteTaskParams, createResponse } from './helper';
import { TaskModel, UserModel } from '../../models';
import mongoose from 'mongoose';

//Ажилтан хийсэн task бүртгэх
export const completeTask = async (
  req: CompleteTaskParams,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, taskId } = req.body;
    const user = await UserModel.findById(userId);
    const task = await TaskModel.findById(taskId);
    if (user && task) {
      if (user.completedTasks.some((id) => id.equals(task._id))) {
        res
          .status(400)
          .json(createResponse(false, 'Task аль хэдийн бүртгэгдсэн байна'));
      }

      user.completedTasks.push(new mongoose.Types.ObjectId(taskId));
      await user.save();
      res.status(200).json(createResponse(true, 'Task амжилттай хийлээ'));
    } else {
      res
        .status(404)
        .json(createResponse(false, 'Ажилтан эсвэл task олдсонгүй'));
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
