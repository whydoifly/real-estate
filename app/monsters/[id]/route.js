import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const monster = await Monster.findById(params.id).lean();
    if (!monster) {
      return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
    }
    return NextResponse.json(monster);
  } catch (error) {
    console.error('Error fetching monster:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
