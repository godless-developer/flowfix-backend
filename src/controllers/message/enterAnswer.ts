import { Request, Response } from 'express';
import { QuestionModel, TotalQuestionModel } from '../../models';
import { fileUploadToPinecone } from '../../utils/fileUploadToPinecone';
import dotenv from 'dotenv';
import { assistant } from '../../connectPinecone';
dotenv.config();

export const enterAnswer = async (req: Request, res: Response) => {
  try {
    const { id, answer_text, isSolved } = req.body;

    await QuestionModel.findByIdAndUpdate(id, {
      answer_text,
      isSolved: isSolved ?? true,
    });
    const answeredQuestions = await QuestionModel.find({
      isSolved: true,
      answer_text: { $ne: '' },
    });
    // const answers = answeredQuestions.map((question) => {
    //   return question.answer_text;
    // });
    const answers = answeredQuestions.map((question) => {
      return { question: question.question_text, answer: question.answer_text };
    });
    const txtPath = `uploads/all-entered-answers.txt`;
    const existedFileInfo = await TotalQuestionModel.findById(
      process.env.TOTAL_QUESTION_ID
    );
    if (existedFileInfo?.fileId) {
      await assistant.deleteFile(existedFileInfo?.fileId);
    }

    const uploadedFile = await fileUploadToPinecone(
      txtPath,
      JSON.stringify(answers, null, 2)
    );

    await TotalQuestionModel.findByIdAndUpdate(process.env.TOTAL_QUESTION_ID, {
      fileId: uploadedFile.id,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(404).json({ error });
  }
};
//log
