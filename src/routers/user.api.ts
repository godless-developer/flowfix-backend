import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  updateUser,
} from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/list', getUser);

userRouter.get('/byEmail/:email', getUserByEmail);

userRouter.post('/add', createUser);

userRouter.delete('/delete', deleteUser);

userRouter.put('/update/:id', updateUser);
