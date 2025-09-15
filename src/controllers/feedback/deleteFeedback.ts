import { Request, Response } from 'express';
import { FeedbackModel } from '../../models';

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const feedback = await FeedbackModel.findByIdAndDelete(id);
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
