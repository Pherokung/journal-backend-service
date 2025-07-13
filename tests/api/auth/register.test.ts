import { POST } from '@/app/api/auth/register/route';
import User from '@/models/User';
import { NextRequest } from 'next/server';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(201);

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user?.email).toBe('test@example.com');
  });
});