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