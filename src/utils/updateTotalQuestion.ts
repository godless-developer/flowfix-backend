import { TotalQuestionModel } from '../models';
import dotenv from 'dotenv';
dotenv.config();

export const updateTotalQuestion = async () => {
  try {
    const totalAmount = await TotalQuestionModel.findById(
      process.env.TOTAL_QUESTION_ID
    );
    await TotalQuestionModel.findByIdAndUpdate(process.env.TOTAL_QUESTION_ID, {
      amount: Number(totalAmount?.amount) + 1,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Internal server error:total question');
  }
};
