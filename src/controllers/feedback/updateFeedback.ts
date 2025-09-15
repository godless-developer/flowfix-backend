import { Request, Response } from 'express';
import { FeedbackModel } from '../../models';

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id, categoryId, question, isSolved, answer, unknown } = req.body;
    const isExist = await FeedbackModel.findById(id);
    if (!isExist) {
      throw new Error('Feedback not found');
    }
    await FeedbackModel.findByIdAndUpdate(id, {
      categoryId,
      question,
      unknown,
      isSolved,
      answer,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
