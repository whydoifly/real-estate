import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Toggle favorite status
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { propertyId } = await request.json();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const isFavorite = user.favorites.includes(propertyObjectId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (id) => !id.equals(propertyObjectId)
      );
    } else {
      user.favorites.push(propertyObjectId);
    }

    await user.save();

    return NextResponse.json({
      isFavorite: !isFavorite,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    );
  }
}

// Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id)
      .populate('favorites')
      .select('favorites');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
