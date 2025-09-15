import { Request, Response } from 'express';
import { QuestionModel } from '../../models';
import mongoose from 'mongoose';

export const deleteMessageMongo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error('Message id required');
    }
    if (!mongoose.isValidObjectId(id))
      return res.json({
        success: true,
        message: 'Message deleted successfully',
      });

    const delQuestion = await QuestionModel.findById(id).lean();

    if (delQuestion) {
      await QuestionModel.findByIdAndDelete(id);
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.log(error);
    throw new Error('Failed to delete message');
  }
};
