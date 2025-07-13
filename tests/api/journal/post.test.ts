import { POST } from '@/app/api/journal/route';
import JournalEntry from '@/models/JournalEntry';
import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';
import { createAuthRequest } from '@/tests/utils/mockAuth';
import { NextRequest } from 'next/server'; 

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000);

afterEach(async () => {
  await clearDatabase();
});

describe('POST /api/journal', () => {
  it('should create a new journal entry', async () => {
    const req = await createAuthRequest();
    const response = await POST(req);
    
    expect(response.status).toBe(201);
    
    const entries = await JournalEntry.find({});
    expect(entries.length).toBe(1);
    expect(entries[0].title).toBe('Test Entry');
  });

  it('should reject unauthenticated requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/journal', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        title: 'Test Entry',
        content: 'Test content'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});