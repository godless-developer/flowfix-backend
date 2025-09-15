import { NextFunction, Response } from 'express';
import { UpdateTaskRequest, createResponse } from './helper';
import { isValidObjectId } from 'mongoose';
import { TaskModel } from '../../models';

//Task update
export const updateTask = async (
  req: UpdateTaskRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json(createResponse(false, 'Invalid task ID'));
      return;
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    if (Object.keys(filteredUpdates).length === 0) {
      res.status(400).json(createResponse(false, 'No valid updates provided'));
      return;
    }

    console.log('Updating task:', id, 'with:', filteredUpdates);

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { ...filteredUpdates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!updatedTask) {
      res.status(404).json(createResponse(false, 'Task not found'));
      return;
    }

    res
      .status(200)
      .json(createResponse(true, 'Task updated successfully', updatedTask));
  } catch (error) {
    console.error('Update task error:', error);
    next(error);
  }
};
