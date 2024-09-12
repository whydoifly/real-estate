import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request, { params }) {
  console.log(`API route called for monster id: ${params.id}`);
  try {
    await dbConnect();
    console.log('Connected to database');
    const monster = await Monster.findById(params.id).lean();
    console.log('Fetched monster from database:', monster);
    if (!monster) {
      console.log('Monster not found');
      return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
    }
    console.log('Returning monster data');
    return NextResponse.json(monster);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
