import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import authMiddleware from './middleware/authMiddleware';
import mongoose from 'mongoose';
import { getAnswer } from './utils';
import { IUser, UserModel } from './models/user.models';
import {
  feedbackRouter,
  taskRouter,
  fileRouter,
  happynessRouter,
  messageRouter,
  userRouter,
} from './routers';
import { decodeToken } from './utils/decodeToken';
import { dashboardRouter } from './routers/dashboard.api';

dotenv.config();
const app = express();
const mongoDB = process.env.MONGO_DB;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/users', userRouter);
app.use('/file', fileRouter);
app.use('/message', messageRouter);
app.use('/feedback', feedbackRouter);
app.use('/happyness', happynessRouter);
app.use(`/tasks`, taskRouter);
app.use(`/dashboard`, dashboardRouter);

mongoose
  .connect(mongoDB || '')
  .then(() => console.log('MongoDB connected !!'))
  .catch(() => console.log('MongoDB connection failed'));
// Хэрэглэгчийн session үүсгэх JWT-н нууц түлхүүр
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const router = express.Router();

router.post('/auth/google', async (req, res) => {
  try {
    const { code, code_verifier, isWeb } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    // ensure env variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Missing Google client secrets' });
    }
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const redirect_uri = isWeb
      ? process.env.GOOGLE_REDIRECT_URI_WEB || ''
      : process.env.GOOGLE_REDIRECT_URI_EXTENSION || ''; // must equal chrome.identity.getRedirectURL()

    const params = new URLSearchParams();

    params.append('client_id', process.env.GOOGLE_CLIENT_ID!);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    if (code_verifier) {
      params.append('code_verifier', code_verifier);
    }

    const tokenResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenResp.json();
    if (tokenData.error) return res.status(400).json(tokenData);

    const { id_token, access_token, refresh_token } = tokenData;

    // decode id_token to get user info
    const decoded: any = jwt.decode(id_token);
    if (!decoded) return res.status(400).json({ error: 'Invalid id_token' });

    // find or create user in DB
    let user = await UserModel.findOne({ email: decoded.email }).lean();
    if (!user) {
      const newUser = await UserModel.create({
        first_name: decoded.given_name || decoded.name?.split(' ')[0] || '',
        last_name: decoded.family_name || '',
        email: decoded.email,
        refresh_token: refresh_token || '',
        user_role_id: 'worker',
      });
      user = newUser.toObject();
    } else {
      // update refresh token
      await UserModel.findByIdAndUpdate(user._id, {
        refresh_token: refresh_token || user.refresh_token,
      });
    }

    // create session token (JWT)
    const sessionToken = jwt.sign(
      {
        sub: decoded.sub,
        _id: (user as any)._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      access_token,
      refresh_token,
      user: {
        name: decoded.name,
        email: decoded.email,
        profile_img: decoded.picture || '',
      },
      sessionToken,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// AI чат API
app.post(
  '/api/chat',
  //authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = decodeToken(req.headers.authorization!);
      const userData = user.data as unknown as IUser;
      const { content } = req.body;
      if (!content) {
        res.status(400).json({ error: 'Message content required' });
        return;
      }
      const userInfo = JSON.stringify(userData);

      const chatResp = await getAnswer(content, userInfo);

      res.json({
        content: chatResp ?? 'AI хариу ирсэнгүй',
        received: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'AI чат ажиллахгүй байна' });
    }
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Hackathon BE server is running on port ${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
