import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import JournalEntry from '@/models/JournalEntry';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const entries = await JournalEntry.find({ user: user._id }).sort({ date: -1 });
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { title, content, date, tags } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const newEntry = new JournalEntry({
      title,
      content,
      date: date || new Date(),
      user: user._id,
      tags: tags || []
    });

    await newEntry.save();
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}