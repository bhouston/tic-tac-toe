import { prisma } from '../prisma';
import { GameResult } from '@prisma/client';

/**
 * Create a new game result
 */
export async function createGameResult(userId: string, outcome: string): Promise<GameResult> {
  return prisma.gameResult.create({
    data: {
      userId,
      outcome,
    },
  });
}

/**
 * Get all game results for a user
 */
export async function getGameResultsByUser(userId: string): Promise<GameResult[]> {
  return prisma.gameResult.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
}

/**
 * Get all game results
 */
export async function getAllGameResults(): Promise<GameResult[]> {
  return prisma.gameResult.findMany({
    include: {
      user: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
}

/**
 * Get leaderboard data with user statistics
 */
export async function getLeaderboardData() {
  // Get all users with their game results
  const usersWithGames = await prisma.user.findMany({
    include: {
      games: true,
    },
  });

  // Calculate statistics for each user
  return usersWithGames.map(user => {
    const totalGames = user.games.length;
    const wins = user.games.filter(game => game.outcome === 'win').length;
    const losses = user.games.filter(game => game.outcome === 'loss').length;
    const draws = user.games.filter(game => game.outcome === 'draw').length;
    
    // Calculate win percentage
    const winPercentage = totalGames > 0 
      ? Math.round((wins / totalGames) * 100) 
      : 0;
    
    // Calculate a score for sorting (prioritize win percentage, then total games)
    const score = (winPercentage * 100) + totalGames;
    
    return {
      id: user.id,
      name: user.name,
      stats: {
        totalGames,
        wins,
        losses,
        draws,
        winPercentage,
      },
      score,
    };
  });
}