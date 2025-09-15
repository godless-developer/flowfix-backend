import { NextFunction, Response } from 'express';
import { TaskParams, createResponse } from './helper';
import { isValidObjectId } from 'mongoose';
import { TaskModel } from '../../models';

//Task устгах
export const deleteTask = async (
  req: TaskParams,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json(createResponse(false, 'Invalid task ID'));
      return;
    }

    console.log('Soft deleting task:', id);

    const deletedTask = await TaskModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!deletedTask) {
      res.status(404).json(createResponse(false, 'Task not found'));
      return;
    }

    res
      .status(200)
      .json(
        createResponse(true, 'Task deleted successfully', {
          id: deletedTask._id,
        })
      );
  } catch (error) {
    console.error('Delete task error:', error);
    next(error);
  }
};
