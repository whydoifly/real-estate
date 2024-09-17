import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request) {
  await dbConnect();

  try {
    const monsters = await Monster.find({}).lean();
    return NextResponse.json({ monsters }); // Wrap monsters in an object
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monsters' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  await dbConnect();

  try {
    const data = await request.json();
    const monster = await Monster.create(data);
    return NextResponse.json({ monster }, { status: 201 }); // Wrap monster in an object
  } catch (error) {
    console.error('Error creating monster:', error);
    return NextResponse.json(
      { error: 'Failed to create monster' },
      { status: 500 }
    );
  }
}
