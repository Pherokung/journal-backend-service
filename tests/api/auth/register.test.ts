import { POST } from '@/app/api/auth/register/route';
import User from '@/models/User';

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const req = {
      json: () => Promise.resolve({
        email: 'test@example.com',
        password: 'password123'
      })
    } as any;

    const response = await POST(req);
    
    // Debug output
    console.log('Response status:', response.status);
    if (response.status !== 201) {
      const body = await response.json();
      console.log('Error response:', body);
    }

    expect(response.status).toBe(201);

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user?.email).toBe('test@example.com');
  });
});