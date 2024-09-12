import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request, { params }) {
  await dbConnect();
  const monster = await Monster.findById(params.id).lean();
  if (!monster) {
    return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
  }
  return NextResponse.json(monster);
}
