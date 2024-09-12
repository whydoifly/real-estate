// app/api/monsters/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET() {
  await dbConnect();
  const monsters = await Monster.find({}).lean();
  return NextResponse.json(monsters);
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const monster = await Monster.create(data);
  return NextResponse.json(monster);
}

