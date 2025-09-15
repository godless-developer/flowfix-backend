import { Router } from 'express';
import {
  addUnansweredQuestion,
  deleteMessage,
  deleteMessageMongo,
  enterAnswer,
  getQuestions,
} from '../controllers/message';

export const messageRouter = Router();

messageRouter.get('/unanswered-questions', getQuestions);

messageRouter.delete('/', deleteMessage);

messageRouter.delete('/from-mongo/:id', deleteMessageMongo);

messageRouter.post('/unanswered', addUnansweredQuestion);

messageRouter.put('/', enterAnswer);
