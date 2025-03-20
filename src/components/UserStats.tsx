'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

interface UserStatsProps {
  user: User;
}

interface Stats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

const UserStats = ({ user }: UserStatsProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [user.id]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/game-results?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Could not load your game statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-2">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-center py-2 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-2">No stats available</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Your Game Stats
      </h2>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {stats.wins}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Wins</div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {stats.losses}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Losses</div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md">
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.draws}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Draws</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {stats.totalGames}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>
      
      {stats.totalGames > 0 && (
        <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
          Win rate: {Math.round((stats.wins / stats.totalGames) * 100)}%
        </div>
      )}
    </div>
  );
};

export default UserStats;