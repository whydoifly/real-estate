import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function GET(request) {
  console.log('GET /api/monsters called');

  try {
    console.log('Attempting to connect to database...');
    await dbConnect();
    console.log('Database connection successful');

    console.log('Fetching monsters...');
    const monsters = await Monster.find({}).lean();
    console.log(`Found ${monsters.length} monsters`);

    return NextResponse.json({ monsters });
  } catch (error) {
    console.error('Error in GET /api/monsters:', error);

    // Return more detailed error information
    return NextResponse.json(
      {
        error: 'Failed to fetch monsters',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  console.log('POST /api/monsters called');

  try {
    await dbConnect();
    console.log('Database connection successful');

    const data = await request.formData();
    console.log(
      'Received form data:',
      [...data.entries()].map(([key, value]) =>
        key === 'image' ? `${key}: [File]` : `${key}: ${value}`
      )
    );

    const file = data.get('image');
    let imagePath = null;

    if (file) {
      // ... image handling code ...
    }

    const monsterData = {
      name: data.get('name'),
      type: data.get('type'),
      size: data.get('size'),
      alignment: data.get('alignment'),
      armorClass: Number(data.get('armorClass')),
      hitPoints: Number(data.get('hitPoints')),
      speed: data.get('speed'),
      strength: Number(data.get('strength')),
      dexterity: Number(data.get('dexterity')),
      constitution: Number(data.get('constitution')),
      intelligence: Number(data.get('intelligence')),
      wisdom: Number(data.get('wisdom')),
      charisma: Number(data.get('charisma')),
      challengeRating: Number(data.get('challengeRating')),
      description: data.get('description'),
      image: imagePath,
    };

    console.log('Creating monster with data:', monsterData);
    const monster = await Monster.create(monsterData);
    console.log('Monster created successfully:', monster._id);

    return NextResponse.json({ monster }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/monsters:', error);
    return NextResponse.json(
      {
        error: 'Failed to create monster',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
