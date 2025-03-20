import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint is for development/testing only
// It adds sample game results for existing users
export async function POST() {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'No users found. Create users first.' },
        { status: 400 }
      );
    }
    
    // Sample outcomes
    const outcomes = ['win', 'loss', 'draw'];
    
    // Create random game results for each user
    const results = [];
    
    for (const user of users) {
      // Random number of games between 5-15
      const numGames = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < numGames; i++) {
        // Random outcome
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        const result = await prisma.gameResult.create({
          data: {
            userId: user.id,
            outcome,
          },
        });
        
        results.push(result);
      }
    }
    
    return NextResponse.json({
      message: `Created ${results.length} sample game results`,
      count: results.length,
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { message: 'Failed to create test data' },
      { status: 500 }
    );
  }
}