import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, outcome } = await request.json();
    
    // Validate inputs
    if (!userId || !outcome) {
      return NextResponse.json(
        { message: 'User ID and outcome are required' },
        { status: 400 }
      );
    }
    
    // Validate outcome
    if (!['win', 'loss', 'draw'].includes(outcome)) {
      return NextResponse.json(
        { message: 'Outcome must be "win", "loss", or "draw"' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Record game result
    const gameResult = await prisma.gameResult.create({
      data: {
        outcome,
        userId,
      },
    });
    
    // Get user stats
    const stats = await getUserStats(userId);
    
    return NextResponse.json({ gameResult, stats });
  } catch (error) {
    console.error('Error recording game result:', error);
    return NextResponse.json(
      { message: 'Failed to record game result' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const stats = await getUserStats(userId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch game stats' },
      { status: 500 }
    );
  }
}

// Helper function to get user stats
async function getUserStats(userId: string) {
  const results = await prisma.gameResult.findMany({
    where: { userId },
  });
  
  const wins = results.filter(result => result.outcome === 'win').length;
  const losses = results.filter(result => result.outcome === 'loss').length;
  const draws = results.filter(result => result.outcome === 'draw').length;
  const totalGames = results.length;
  
  return {
    wins,
    losses,
    draws,
    totalGames,
  };
}