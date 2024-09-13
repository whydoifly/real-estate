// app/api/monsters/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

  await dbConnect();

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { type: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const total = await Monster.countDocuments(query);
    const monsters = await Monster.find(query).skip(skip).limit(limit).lean();

    return NextResponse.json({
      monsters,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const monster = await Monster.create(data);
  return NextResponse.json(monster);
}
