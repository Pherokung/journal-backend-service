import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import JournalEntry from '@/models/JournalEntry';
import dbConnect from '@/lib/dbConnect';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: params.id, user: user._id },
      { title, content, date: date || new Date(), tags: tags || [] },
      { new: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const deletedEntry = await JournalEntry.findOneAndDelete({
      _id: params.id,
      user: user._id
    });

    if (!deletedEntry) {
      return NextResponse.json(
        { message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticateUser(request);
  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { action, tag } = await request.json();

    if (!action || !tag) {
      return NextResponse.json(
        { message: 'Action and tag are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    let update;
    if (action === 'add') {
      update = { $addToSet: { tags: tag } };
    } else if (action === 'remove') {
      update = { $pull: { tags: tag } };
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use "add" or "remove".' },
        { status: 400 }
      );
    }

    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: params.id, user: user._id },
      update,
      { new: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}