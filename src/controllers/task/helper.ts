import { Request } from 'express';
import { TaskType } from '../../models/task.model';

export interface CreateTaskRequest extends Request {
    body: {
      title: string;
      priority: number;
      description: string;
      type?: TaskType;
      createdBy: string;
      isActive: boolean;
      workingDays?: number;
    };
  }
  
  export interface TaskQuery extends Request {
    body: {
      type?: TaskType;
    };
  }
  
 export interface TaskParams extends Request {
    params: {
      id: string;
    };
  }
  
 export interface CompleteTaskParams extends Request {
    body: {
      userId: string;
      taskId: string;
    };
  }
  
 export interface UpdateTaskRequest extends Request {
    params: {
      id: string;
    };
    body: Partial<{
      title: string;
      description: string;
      priority: number;
      type: TaskType;
      workingDays: string | Date;
      isActive: boolean;
    }>;
  }
  
 export const createResponse = (success: boolean, message: string, data?: any) => ({
    success,
    message,
    ...(data && { data }),
  });