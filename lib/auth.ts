import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import dbConnect from './dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export async function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: MAX_AGE });
}

export function setTokenCookie(token: string) {
  cookies().set('authToken', token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  });
}

export function clearTokenCookie() {
  cookies().delete('authToken');
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) return null;

  const userId = await verifyToken(token);
  if (!userId) return null;

  await dbConnect();
  const user = await User.findById(userId);
  
  return user;
}