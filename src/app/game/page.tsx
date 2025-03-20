'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '@/components/GameBoard';
import UserStats from '@/components/UserStats';
import { User } from '@prisma/client';

export default function GamePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshStats, setRefreshStats] = useState(0);

  useEffect(() => {
    // Check if user data exists in sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (err) {
        console.error('Error parsing user data:', err);
        redirectToWelcome();
      }
    } else {
      // Try to get the most recent user from the API
      fetchLastUser();
    }
  }, []);

  const fetchLastUser = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      if (users.length > 0) {
        // Use the most recent user
        const mostRecentUser = users.sort((a: User, b: User) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        
        setUser(mostRecentUser);
        // Store in session
        sessionStorage.setItem('user', JSON.stringify(mostRecentUser));
        setLoading(false);
      } else {
        redirectToWelcome();
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      redirectToWelcome();
    }
  };

  const redirectToWelcome = () => {
    setError('Please register before playing');
    setTimeout(() => {
      router.push('/welcome');
    }, 2000);
  };

  const handleGameComplete = async (outcome: 'win' | 'loss' | 'draw') => {
    if (!user) return;
    
    try {
      await fetch('/api/game-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          outcome,
        }),
      });
      
      // Trigger stats refresh
      setRefreshStats(prev => prev + 1);
    } catch (err) {
      console.error('Error recording game result:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Loading Game...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Tic Tac Toe Game
          </h1>
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Redirecting to welcome page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Tic Tac Toe Game
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Welcome, {user?.name}! Let's play!
        </p>
        
        {user && <UserStats user={user} key={refreshStats} />}
        
        {user && <GameBoard user={user} onGameComplete={handleGameComplete} />}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/welcome')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Back to Welcome Page
          </button>
        </div>
      </main>
    </div>
  );
}