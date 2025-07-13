import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  try {
    console.log('Register request received');
    await dbConnect();
    console.log('DB connected');
    
    const { email, password } = await request.json();
    console.log('Parsed data:', { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    console.log('Existing user check:', existingUser);
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const user = new User({ email, password });
    await user.save();
    console.log('User created:', user);

    return NextResponse.json(
      { user: { id: user._id, email: user.email } },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}