import moment from 'moment';
import { HappynessModel } from '../../models';
import { Request, Response } from 'express';

export const createHappyness = async (req: Request, res: Response) => {
  const { userId, emotion } = req.body;
  const date = moment().format('YYYY-MM-DD');

  try {
    if (!userId || !emotion) {
      throw new Error('Шаардлагатай утгууд дутуу байна');
    }
    let day = await HappynessModel.findOne({ date });

    if (!day) {
      await HappynessModel.create({
        date,
        emotion: [{ emotionIndex: emotion, users: [userId] }],
      });
      return res.json({ success: true });
    }

    const currentEmotionObj = day.emotion.find((e) => e.users.includes(userId));

    if (!currentEmotionObj) {
      const targetEmotionObj = day.emotion.find(
        (e) => e.emotionIndex === emotion
      );

      if (targetEmotionObj) {
        targetEmotionObj.users.push(userId);
        await day.save();
      } else {
        day.emotion.push({ emotionIndex: emotion, users: [userId] });
        await day.save();
      }
    } else if (currentEmotionObj.emotionIndex !== emotion) {
      currentEmotionObj.users = currentEmotionObj.users.filter(
        (u) => u.toString() !== userId
      );

      let targetEmotionObj = day.emotion.find(
        (e) => e.emotionIndex === emotion
      );
      if (!targetEmotionObj) {
        targetEmotionObj = { emotionIndex: emotion, users: [userId] };
        day.emotion.push(targetEmotionObj);
      }
      if (!targetEmotionObj.users.includes(userId)) {
        targetEmotionObj.users.push(userId);
      }

      await day.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
};
//notion.so
