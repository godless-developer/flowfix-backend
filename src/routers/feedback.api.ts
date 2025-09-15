import express from 'express';
import {
  createCategory,
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getCategories,
  getFeedbackCurrentUser,
  updateFeedback,
} from '../controllers/feedback';

export const feedbackRouter = express.Router();

feedbackRouter.post('/category', createCategory);

feedbackRouter.post('/add-new', createFeedback);

feedbackRouter.put('/', updateFeedback);

feedbackRouter.get('/categories', getCategories);

feedbackRouter.delete('/', deleteFeedback);

feedbackRouter.get('/user/:id', getFeedbackCurrentUser);

feedbackRouter.get('/list', getAllFeedback);
