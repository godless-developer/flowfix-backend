import { Request, Response } from 'express';
import { FeedbackModel } from '../../models';

export const getFeedbackCurrentUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feedbacks = await FeedbackModel.find({
      userId: id,
    }).populate('categoryId', 'categoryName');
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.json({ success: false, error });
  }
};
