import { Request, Response } from 'express';
import { FeedbackCategoryModel } from '../../models';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await FeedbackCategoryModel.find().lean();
    res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
