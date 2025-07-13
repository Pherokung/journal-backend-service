import { GET, POST } from '@/app/api/journal/route';
import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';
import { createAuthRequest } from '@/tests/utils/mockAuth';
import { NextRequest } from 'next/server';

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000);

afterEach(async () => {
  await clearDatabase();
});

describe('GET /api/journal', () => {
  it('should create and fetch entries', async () => {
    const createReq = await createAuthRequest();
    const postResponse = await POST(createReq);
    expect(postResponse.status).toBe(201);

    const getReq = new NextRequest('http://localhost:3000/api/journal', {
      headers: new Headers({
        'Cookie': createReq.headers.get('Cookie') || ''
      })
    });
    
    const getResponse = await GET(getReq);
    expect(getResponse.status).toBe(200);
    
    const data = await getResponse.json();
    expect(data.length).toBe(1);
    expect(data[0].title).toBe('Test Entry');
  });

  it('should return empty array for new users', async () => {
    const req = await createAuthRequest();
    const response = await GET(req);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.length).toBe(0);
  });
});