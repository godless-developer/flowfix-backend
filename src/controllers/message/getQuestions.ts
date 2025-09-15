import { Request, Response } from 'express';
import { QuestionModel } from '../../models';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { score, origin, isSolved, question_text, answer_text } = req.query;
    const response = await QuestionModel.find().lean();
    res.json({ success: true, questions: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

// import { index } from "../../connectPinecone";
// import { Response, Request } from "express";

// export const getQuestionsPinecone = async (req: Request, res: Response) => {
//   const topK = 20;
//   try {
//     const dummyVector = new Array(1024).fill(0); // Adjust dimension based on your embedding model

//     const searchResponse = await index.query({
//       vector: dummyVector,
//       topK: topK, // Large number to get all results
//       includeMetadata: true,
//       filter: {
//         status: { $eq: "unanswered" },
//       },
//     });

//     const questions =
//       searchResponse.matches?.map((match) => ({
//         id: match.id,
//         question: match.metadata?.question,
//         score: match.metadata?.score,
//         status: match.metadata?.status,
//         similarity: match.score, // This won't be meaningful with dummy vector
//       })) || [];

//     res.json({ data: questions });
//   } catch (error) {
//     console.error("Error fetching questions by status:", error);
//     res.json({ data: [] });
//   }
// };
