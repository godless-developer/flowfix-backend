import express from 'express';
import {
  createHappyness,
  getHappyness,
  getHappynessByUserId,
} from '../controllers/happiness';

export const happynessRouter = express.Router();

happynessRouter.post('/', createHappyness);

happynessRouter.get('/', getHappyness);

happynessRouter.get('/:id', getHappynessByUserId);
