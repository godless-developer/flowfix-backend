import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskByUser,
  completeTask,
  deleteTask,
  updateTask,
} from '../controllers/task';

export const taskRouter = Router();

taskRouter.post('/add', createTask);

taskRouter.post('/', getTasks);

taskRouter.get('/:id', getTaskByUser);

taskRouter.post('/completeTask', completeTask);

taskRouter.get('/delete/:id', deleteTask);

taskRouter.post('/update/:id', updateTask);
