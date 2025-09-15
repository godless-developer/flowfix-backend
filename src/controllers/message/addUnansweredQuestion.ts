import { Request, Response } from 'express';
import { QuestionModel } from '../../models';
import { addQuestion } from './addQuestion';

export const addUnansweredQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const added = await addQuestion({
      question,
      score: 0,
    });
    if (added) {
      const newQuestion = await QuestionModel.create({
        question_text: question,
        score: 0,
        existing_files: [],
        origin: 'user',
      });
      return res.json({ success: true, id: newQuestion.id });
    }

    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error: add unanswered question',
    });
  }
};
