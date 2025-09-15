import { Request, Response } from 'express';
import { HappynessModel } from '../../models';
import moment from 'moment';

export const getHappynessByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const date = moment().format('YYYY-MM-DD');

    const happyness = await HappynessModel.findOne({
      date,
      'emotion.users': id,
    }).lean();
    if (happyness) {
      const index = happyness.emotion.find((emotion) =>
        emotion.users.toString().includes(id)
      );
      return res.json({ index: index?.emotionIndex });
    }
    return res.json('medeelel oldsongui');
  } catch (error) {
    res.status(500).json({ error });
  }
};
