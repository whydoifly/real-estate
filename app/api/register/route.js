import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  console.log('Register API route called');
  try {
    await dbConnect();
    console.log('Connected to database');

    const body = await request.json();
    console.log('Received registration data:', body);

    const { email, password, nickname } = body;

    // Validation
    if (!email || !password || !nickname) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      console.log('Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use');
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    const user = new User({ email, password, nickname });
    await user.save();

    console.log('User registered successfully');
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in registration API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.toString() },
      { status: 500 }
    );
  }
}
