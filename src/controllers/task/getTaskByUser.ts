import { NextFunction, Response } from 'express';
import { TaskParams, createResponse } from './helper';
import mongoose from 'mongoose';
import { TaskModel, UserModel } from '../../models';
import moment from 'moment';

//Ажилтны ID-ээр хийгдсэн task-уудыг авах
export const getTaskByUser = async (
  req: TaskParams,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const completedTask: Array<any> = [];
  const taskType: Array<any> = [];

  try {
    const { id } = req.params;

    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user_role: 'worker',
    }).lean();
    //moment("20111031", "YYYYMMDD").fromNow();
    if (user) {
      const mom = moment(user.startedJobAt, 'YYYYMMDD').fromNow();
      if (mom.includes('year')) {
        taskType.push('normal', 'urgent');
      } else if (mom.includes('month')) {
        taskType.push('normal', 'urgent', 'probation');
      } else {
        taskType.push('normal', 'urgent', 'probation', 'onboarding');
      }

      if (user?.completedTasks)
        await TaskModel.find({
          type: { $in: taskType },
        })
          .sort({ createdAt: -1, priority: 1 })
          .lean()
          .then((tasks) =>
            tasks.map((task) =>
              completedTask.push({
                ...task,
                checked: user.completedTasks
                  .toString()
                  .includes(task._id.toString()),
              })
            )
          );

      res
        .status(200)
        .json(createResponse(true, 'User-ийн хийсэн task:', completedTask));
    } else {
      res.status(400).json(createResponse(false, 'Ажилтан олдсонгүй.'));
    }
  } catch (error) {}
};
