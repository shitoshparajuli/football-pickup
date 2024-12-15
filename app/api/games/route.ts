import { NextResponse } from 'next/server';
import { createGame } from '@/lib/ddbApi';

export async function POST(request: Request) {
  try {
    const { location, startTime, endTime } = await request.json();
    const result = await createGame(location, startTime, endTime);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: 'Failed to create game' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in /api/games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
