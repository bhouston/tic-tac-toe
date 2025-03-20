import { NextResponse } from 'next/server';
import { getLeaderboardData } from '@/lib/db/game-results';

export async function GET() {
  try {
    // Get leaderboard data using the function from game-results.ts
    const leaderboardData = await getLeaderboardData();
    
    // Sort by score (descending)
    const sortedLeaderboard = leaderboardData.sort((a, b) => b.score - a.score);
    
    return NextResponse.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}