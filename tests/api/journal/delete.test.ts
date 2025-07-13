import { DELETE } from '@/app/api/journal/[id]/route';
import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';
import { createAuthRequest } from '@/tests/utils/mockAuth';
import JournalEntry from '@/models/JournalEntry';
import User from '@/models/User';
import mongoose from 'mongoose'; 

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000); 

afterEach(async () => {
  await clearDatabase();
});

describe('DELETE /api/journal/:id', () => {
  it('should delete a journal entry', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const entry = await JournalEntry.create({
      title: 'Test Entry',
      content: 'Test content',
      user: user._id
    });

    const req = await createAuthRequest(user);
    const params = { id: entry._id.toString() };

    const response = await DELETE(req, { params } as any);
    
    expect(response.status).toBe(200);
    expect(await JournalEntry.findById(entry._id)).toBeNull();
  });

  it('should reject unauthorized deletion attempts', async () => {
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
      content: 'Should not be deleted',
      user: owner._id
    });

    const req = await createAuthRequest(otherUser);
    const params = { id: entry._id.toString() };
    const response = await DELETE(req, { params } as any);
    
    expect([403, 404]).toContain(response.status);
    expect(await JournalEntry.findById(entry._id)).toBeTruthy();
  });

  it('should return 404 for non-existent entries', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const req = await createAuthRequest(user);

    const params = { id: new mongoose.Types.ObjectId().toString() };
    const response = await DELETE(req, { params } as any);
    
    expect(response.status).toBe(404);
  });
});