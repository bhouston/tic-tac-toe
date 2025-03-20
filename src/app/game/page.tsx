'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();
  const [message, setMessage] = useState('Loading game...');
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    // In a real implementation, we would check if the user is registered
    // For now, this is just a placeholder
    const checkUserRegistration = async () => {
      try {
        // Here we would fetch user data or check session
        // For now, just display a message
        setMessage('Game page is under construction. Coming soon!');
      } catch (error) {
        console.error('Error checking user registration:', error);
        setMessage('Error loading game. Please try again.');
      }
    };

    checkUserRegistration();
  }, []);
  
  const handlePlayAgain = () => {
    // In a real implementation, this would reset the game state
    setMessage('Starting a new game...');
    // Simulate game loading
    setTimeout(() => {
      setMessage('Game page is under construction. Coming soon!');
      setGameEnded(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Tic Tac Toe Game
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        
        {gameEnded && (
          <button
            onClick={handlePlayAgain}
            className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Play Again
          </button>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            View Leaderboard
          </button>
          <button
            onClick={() => router.push('/welcome')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Back to Welcome
          </button>
        </div>
      </main>
    </div>
  );
}