'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import { User } from '@prisma/client';

export default function GamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [gameStats, setGameStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0
  });

  useEffect(() => {
    // Fetch the first user from the database
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        
        if (users.length === 0) {
          // If no users exist, redirect to welcome page to create one
          router.push('/welcome');
          return;
        }
        
        // Use the first user in the database
        setUser(users[0]);
        
        // Also fetch this user's stats
        try {
          const statsResponse = await fetch(`/api/game-results?userId=${users[0].id}`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setGameStats({
              wins: stats.wins,
              losses: stats.losses,
              draws: stats.draws,
              total: stats.totalGames
            });
          }
        } catch (statsError) {
          console.error('Error fetching user stats:', statsError);
        }
        
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Could not load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [router]);

  const handleGameComplete = async (outcome: 'win' | 'loss' | 'draw') => {
    // Update stats locally for immediate feedback
    setGameStats(prev => {
      const newStats = { ...prev };
      newStats[outcome === 'win' ? 'wins' : outcome === 'loss' ? 'losses' : 'draws']++;
      newStats.total++;
      return newStats;
    });

    // In a real implementation, save the result to the database
    try {
      await fetch('/api/game-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          outcome
        }),
      });
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Tic Tac Toe Game
          </h1>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Tic Tac Toe Game
          </h1>
          <p className="text-red-500 mb-6">
            {error || "Error loading game. Please register first."}
          </p>
          <button
            onClick={() => router.push('/welcome')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go to Welcome Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Tic Tac Toe Game
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Welcome, <span className="font-semibold">{user.name}</span>!
          </p>
          
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Wins</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{gameStats.wins}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Losses</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{gameStats.losses}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
              <p className="text-xs text-gray-500 dark:text-gray-400">Draws</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{gameStats.draws}</p>
            </div>
          </div>
        </div>
        
        <GameBoard user={user} onGameComplete={handleGameComplete} />
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            View Leaderboard
          </button>
          <button
            onClick={() => router.push('/welcome')}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            Back to Welcome
          </button>
        </div>
      </main>
    </div>
  );
}