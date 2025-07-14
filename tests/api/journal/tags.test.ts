import { PATCH } from '@/app/api/journal/[id]/route';
import { POST as POST_ENTRY } from '@/app/api/journal/route';
import JournalEntry from '@/models/JournalEntry';
import User from '@/models/User';
import { setupTestEnvironment, clearDatabase } from '@/tests/utils/testDb';
import { NextRequest } from 'next/server';

beforeAll(async () => {
  await setupTestEnvironment();
}, 10000);

afterEach(async () => {
  await clearDatabase();
});

describe('PATCH /api/journal/:id (tags)', () => {
  let user: any;
  let entry: any;
  let entryId: string;
  let cookie: string;

  beforeEach(async () => {
    user = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword'
    });

    const req = new NextRequest('http://localhost:3000/api/journal', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': `authToken=mock-token-for-${user._id}`
      }),
      body: JSON.stringify({
        title: 'Tag Test Entry',
        content: 'Entry for tag testing',
        tags: ['initial']
      })
    });

    const postRes = await POST_ENTRY(req);
    const postData = await postRes.json();
    entryId = postData._id || postData.id || postData.data?._id;

    // Fetch the entry from DB to ensure it's there
    entry = await JournalEntry.findById(entryId);
    cookie = `authToken=mock-token-for-${user._id}`;
  });

  it('should add a tag to the journal entry', async () => {
    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${entryId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': cookie
      }),
      body: JSON.stringify({
        action: 'add',
        tag: 'newtag'
      })
    });

    const response = await PATCH(patchReq, { params: { id: entryId } } as any);
    expect(response.status).toBe(200);

    const updated = await JournalEntry.findById(entryId);
    expect(updated?.tags).toContain('newtag');
    expect(updated?.tags).toContain('initial');
  });

  it('should not add duplicate tags', async () => {
    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${entryId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': cookie
      }),
      body: JSON.stringify({
        action: 'add',
        tag: 'initial'
      })
    });

    const response = await PATCH(patchReq, { params: { id: entryId } } as any);
    expect(response.status).toBe(200);

    const updated = await JournalEntry.findById(entryId);

    expect(updated?.tags.filter((t: string) => t === 'initial').length).toBe(1);
  });

  it('should remove a tag from the journal entry', async () => {
    await JournalEntry.findByIdAndUpdate(entryId, { $addToSet: { tags: 'Life' } });

    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${entryId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': cookie
      }),
      body: JSON.stringify({
        action: 'remove',
        tag: 'Life'
      })
    });

    const response = await PATCH(patchReq, { params: { id: entryId } } as any);
    expect(response.status).toBe(200);

    const updated = await JournalEntry.findById(entryId);
    expect(updated?.tags).not.toContain('Life');
  });

  it('should return 400 for invalid action', async () => {
    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${entryId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': cookie
      }),
      body: JSON.stringify({
        action: 'invalid',
        tag: 'sometag'
      })
    });

    const response = await PATCH(patchReq, { params: { id: entryId } } as any);
    expect(response.status).toBe(400);
  });

  it('should return 401 for unauthenticated requests', async () => {
    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${entryId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        action: 'add',
        tag: 'newtag'
      })
    });

    const response = await PATCH(patchReq, { params: { id: entryId } } as any);
    expect(response.status).toBe(401);
  });

  it('should return 404 for non-existent entry', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const patchReq = new NextRequest(`http://localhost:3000/api/journal/${fakeId}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Cookie': cookie
      }),
      body: JSON.stringify({
        action: 'add',
        tag: 'newtag'
      })
    });

    const response = await PATCH(patchReq, { params: { id: fakeId } } as any);
    expect(response.status).toBe(404);
  });
});