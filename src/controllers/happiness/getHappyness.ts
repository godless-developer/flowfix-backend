import { Request, Response } from 'express';
import { HappynessModel } from '../../models';
import moment from 'moment';

export const getHappyness = async (req: Request, res: Response) => {
  const { days } = req.body;

  try {
    const now = moment().endOf('day');
    const start = moment()
      .subtract(Number(days) - 1, 'days')
      .startOf('day');

    const list = await HappynessModel.find({
      date: {
        $gte: start.format('YYYY-MM-DD'),
        $lte: now.format('YYYY-MM-DD'),
      },
    })
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
