import { Response, Request } from 'express';
import { FeedbackModel, UserModel } from '../../models';

export const createFeedback = async (req: Request, res: Response) => {
  const { userId, question, categoryId, unknown } = req.body;

  try {
    const userExist = await UserModel.findById(userId);
    if (!userExist) return res.status(404).json({ error: 'User not found' });
    const newFeedback = await FeedbackModel.create({
      userId,
      question,
      categoryId,
      unknown,
    });
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { feedbacks: newFeedback } },
      { new: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};
