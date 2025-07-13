import { NextRequest } from 'next/server';
import User from '@/models/User';

export async function createAuthRequest(user?: User) {
  const testUser = user || await User.create({
    email: 'test@example.com',
    password: 'hashedpassword'
  });

  return new NextRequest('http://localhost:3000/api/journal', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Cookie': `authToken=mock-token-for-${testUser._id}`
    }),
    body: JSON.stringify({
      title: 'Test Entry',
      content: 'Test content'
    })
  });
}