import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/user.models';

type DecodeToken = {
  success: boolean;
  data: string | IUser | JwtPayload;
};
export const decodeToken = (token: string): DecodeToken => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded !== 'object') {
    return { success: false, data: 'Invalid token' };
  }

  const email = (decoded as any).unique_name || (decoded as any).upn;
  return { success: false, data: decoded };
};
