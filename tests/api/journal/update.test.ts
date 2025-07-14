import { PUT } from '@/app/api/journal/[id]/route';
import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';
import { createAuthRequest } from '@/tests/utils/mockAuth';
import JournalEntry from '@/models/JournalEntry';
import User from '@/models/User';
import { NextRequest } from 'next/server';
import mongoose from 'mongoose'; 

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000); 

afterEach(async () => {
  await clearDatabase();
});

describe('PUT /api/journal/:id', () => {
  it('should update a journal entry', async () => {

    const user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const entry = await JournalEntry.create({
      title: 'Original Title',
      content: 'Original Content',
      user: user._id
    });

    const req = new NextRequest('http://localhost:3000/api/journal', {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': `authToken=mock-token-for-${user._id}`
      }),
      body: JSON.stringify({
        title: 'Updated Title',
        content: 'Updated Content'
      })
    });
    const params = { id: entry._id.toString() };

    const response = await PUT(req, { params } as any);
    
    expect(response.status).toBe(200);

    const updatedEntry = await JournalEntry.findById(entry._id);
    expect(updatedEntry?.title).toBe('Updated Title');
    expect(updatedEntry?.content).toBe('Updated Content');
  });

  it('should reject unauthorized updates', async () => {
    const owner = await User.create({
      email: 'owner@example.com',
      password: 'hashedpassword'
    });
    const otherUser = await User.create({
      email: 'other@example.com',
      password: 'hashedpassword'
    });

    const entry = await JournalEntry.create({
      title: 'Protected Entry',
      content: 'Should not be modified',
      user: owner._id
    });

    const req = new NextRequest('http://localhost:3000/api/journal', {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': `authToken=mock-token-for-${otherUser._id}`
      }),
      body: JSON.stringify({
        title: 'Unauthorized Update',
        content: 'Content'
      })
    });
    const params = { id: entry._id.toString() };
    const response = await PUT(req, { params } as any);
    
    expect([403, 404]).toContain(response.status);
    const unchangedEntry = await JournalEntry.findById(entry._id);
    expect(unchangedEntry?.title).toBe('Protected Entry');
  });

  it('should return 404 for non-existent entries', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const req = new NextRequest('http://localhost:3000/api/journal', {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': `authToken=mock-token-for-${user._id}`
      }),
      body: JSON.stringify({
        title: 'Updated Title',
        content: 'Updated Content'
      })
    });
    const params = { id: new mongoose.Types.ObjectId().toString() };
    const response = await PUT(req, { params } as any);
    
    expect(response.status).toBe(404);
  });
});