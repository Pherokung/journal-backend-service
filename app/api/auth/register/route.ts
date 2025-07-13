import { NextResponse } from 'next/server';
import User from '@/models/User';
import { generateToken, setTokenCookie } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const user = new User({ email, password });
    await user.save();

    const token = await generateToken(user._id.toString());
    const response = NextResponse.json({
      user: { id: user._id, email: user.email }
    });

    setTokenCookie(token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}