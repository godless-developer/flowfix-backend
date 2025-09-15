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

// app.post("/auth/token", async (req, res) => {
//   const { code } = req.body;

//   const params = new URLSearchParams();
//   if (
//     !process.env.AZURE_CLIENT_ID ||
//     !process.env.AZURE_CLIENT_SECRET ||
//     !process.env.AZURE_REDIRECT_URI
//   ) {
//     return res
//       .status(500)
//       .json({ error: "Missing Azure environment variables" });
//   }
//   params.append("client_id", process.env.AZURE_CLIENT_ID);
//   params.append("client_secret", process.env.AZURE_CLIENT_SECRET);
//   params.append("grant_type", "authorization_code");
//   params.append("code", code ?? "");
//   params.append("redirect_uri", process.env.AZURE_REDIRECT_URI);

//   try {
//     const response = await fetch(
//       `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: params,
//       }
//     );

//     const data = await response.json();
//     console.log("data", data);

//     if (data.error) {
//       return res.status(400).json(data);
//     }

//     // энд access_token, id_token-г буцааж болно
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//   }
// });

// Хэрэглэгчийн session үүсгэх JWT-н нууц түлхүүр
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

app.post('/auth/token', async (req, res) => {
  const { code, isWeb } = req.body;
  const email = decodeToken(
    (req.headers as { authorization: string }).authorization
  ).data;

  const params = new URLSearchParams();
  if (
    !process.env.AZURE_CLIENT_ID ||
    !process.env.AZURE_CLIENT_SECRET ||
    !process.env.AZURE_REDIRECT_URI ||
    !process.env.AZURE_REDIRECT_URI_EXTENTION
  ) {
    return res
      .status(500)
      .json({ error: 'Missing Azure environment variables' });
  }
  params.append('client_id', process.env.AZURE_CLIENT_ID);
  params.append('client_secret', process.env.AZURE_CLIENT_SECRET);
  let grantType: string;
  if (email !== 'Invalid token') {
    // Refresh token flow
    const user = await UserModel.findOne({ email }).lean();
    if (!user?.refresh_token) {
      return res.status(400).json({ error: 'No refresh token available' });
    }
    grantType = 'refresh_token';
    params.append('refresh_token', user.refresh_token);
  } else if (code) {
    // Authorization code flow
    grantType = 'authorization_code';
    params.append('code', code);
  } else {
    return res.status(400).json({ error: 'Code or refresh token required' });
  }
  params.append('grant_type', grantType);

  params.append(
    'redirect_uri',
    isWeb
      ? process.env.AZURE_REDIRECT_URI
      : process.env.AZURE_REDIRECT_URI_EXTENTION
  );

  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    const { id_token, refresh_token } = data;
    const decoded = jwt.decode(id_token);

    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ error: 'Invalid id_token' });
    }

    const userExist = await UserModel.findOne({
      email: (decoded as any).email,
    });

    let sessionToken;
    if (!userExist) {
      const newUser = await UserModel.create({
        first_name: (decoded as any).name.split(' ')[0],
        last_name: (decoded as any).name.split(' ')[1],
        email: (decoded as any).email,
        refresh_token: refresh_token,
        user_role_id: 'worker',
      });
      sessionToken = jwt.sign(
        {
          sub: (decoded as any).sub,
          _id: newUser._id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          user_role: newUser.user_role,
          completedTasks: newUser.completedTasks,
          gender: newUser.gender,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
    } else {
      const user = await UserModel.findByIdAndUpdate(userExist.id, {
        refresh_token,
      });
      sessionToken = jwt.sign(
        {
          sub: (decoded as any).sub,
          _id: user?._id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          email: user?.email,
          user_role: user?.user_role,
          completedTasks: user?.completedTasks,
          gender: user?.gender,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
    }

    res.json({
      access_token: data.access_token,
      user: {
        name: (decoded as any).name,
        email: (decoded as any).preferred_username,
        profile_img: userExist?.profile_img || '',
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
