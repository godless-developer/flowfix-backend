import { Request, Response } from 'express';
import { FeedbackModel } from '../../models';

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedbacks = await FeedbackModel.find()
      .populate('userId', 'first_name last_name email phone_number')
      .populate('categoryId', 'categoryName');
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
