import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import dbConnect from './dbConnect';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

// Token generation remains the same
export async function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: MAX_AGE });
}

// Cookie handling for server components
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

// Token verification remains the same
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Updated authenticateUser with dual support
export async function authenticateUser(request: Request | NextRequest) {
  await dbConnect();
  
  let token: string | undefined;
  
  if (request instanceof NextRequest) {
    // For API routes and tests
    token = request.cookies.get('authToken')?.value || 
            request.headers.get('authorization')?.split(' ')[1];
  } else {
    // For server components
    const cookieStore = cookies();
    token = cookieStore.get('authToken')?.value;
  }

  // Allow test tokens in test environment
  if (process.env.NODE_ENV === 'test' && token?.startsWith('mock-token-for-')) {
    const userId = token.replace('mock-token-for-', '');
    return await User.findById(userId);
  }

  if (!token) return null;

  const userId = await verifyToken(token);
  if (!userId) return null;

  return await User.findById(userId);
}

// New helper for API routes
export function getAuthTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get('authToken')?.value || 
         request.headers.get('authorization')?.split(' ')[1] || 
         null;
}