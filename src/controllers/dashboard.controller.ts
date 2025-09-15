import { NextFunction, Request, Response } from 'express';
import {
  HappynessModel,
  QuestionModel,
  StatusType,
  TaskType,
  TotalQuestionModel,
  UserModel,
} from '../models';

type WorkerStats = {
  active: number;
  inactive: number;
  remote: number;
  onvacation: number;
  totalWorker: any;
  [key: string]: number | any;
};

export const getDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workerStats = await getWorkerData();
    const questionsToResolve = await getQuestionData();
    const questionStats = await getQuestionTopics();
    const happinessStats = await getHappinessData();
    const taskTypeCompletions = await getTaskData();

    const data = {
      workerStats,
      questionsToResolve,
      questionStats,
      happinessStats,
      taskTypeCompletions,
      meta: {
        statusType: StatusType,
        taskType: TaskType,
      },
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting task list: ', error);
    next(error);
  }
};

async function getWorkerData() {
  const pipeline = [
    {
      $match: {
        //user_role: 'worker',
        status: { $exists: true },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        statuses: {
          $push: {
            status: '$_id',
            count: '$count',
          },
        },
        total: { $sum: '$count' },
      },
    },
  ];

  const [result] = await UserModel.aggregate(pipeline);

  const workerStats: WorkerStats = {
    active: 0,
    inactive: 0,
    remote: 0,
    onvacation: 0,
    totalWorker: result.total,
  };

  result.statuses.forEach(
    ({ status, count }: { status: string; count: number }) => {
      if (workerStats.hasOwnProperty(status)) {
        workerStats[status] = count;
      }
    }
  );

  return workerStats;
}

async function getQuestionData() {
  const questions = await QuestionModel.find(
    {},
    'question_text answer_text isSolved origin createdAt'
  ).lean();

  return questions;
}

async function getQuestionTopics() {
  const questions = await TotalQuestionModel.find().lean();
  const total = questions[0]?.amount ?? 0;
  const topic = questions[0]?.topics ?? [];

  return { total, topic };
}

async function getHappinessData() {
  const happiness = await HappynessModel.find({}, 'date emotion').lean();
  const happinessdata = happiness.map((item) => {
    return {
      date: item.date,
      emotion: item.emotion.map((e) => ({
        emotionIndex: e.emotionIndex,
        totalWorkers: e.users.length,
      })),
    };
  });
  return happinessdata;
}

async function getTaskData() {
  const taskStats = await UserModel.aggregate([
    { $match: { completedTasks: { $exists: true, $ne: [] } } },
    { $unwind: '$completedTasks' },
    {
      $lookup: {
        from: 'tasks', // Replace with your actual task collection name
        localField: 'completedTasks',
        foreignField: '_id',
        as: 'task',
      },
    },
    { $unwind: { path: '$task', preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: '$task.type',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return taskStats;
}
