import { Request, Response } from 'express';
import { FeedbackCategoryModel } from '../../models';
import { Error } from 'mongoose';

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  try {
    if (!categoryName) {
      return res.json({ success: false, message: 'Enter category name!' });
    }
    const isNameUnique = await FeedbackCategoryModel.findOne({ categoryName });
    if (isNameUnique) {
      throw new Error('Category is exist');
    }
    await FeedbackCategoryModel.create({ categoryName });
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json('Internal server');
  }
};
