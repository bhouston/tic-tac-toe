'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

// Game state types
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];
type GameStatus = 'playing' | 'win' | 'loss' | 'draw';

interface GameBoardProps {
  user: User;
  onGameComplete: (outcome: 'win' | 'loss' | 'draw') => void;
}

const GameBoard = ({ user, onGameComplete }: GameBoardProps) => {
  // Game state
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState<boolean>(false);
  const [userPlayer, setUserPlayer] = useState<Player>('X');
  const [aiPlayer, setAiPlayer] = useState<Player>('O');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Initialize the game
  useEffect(() => {
    initGame();
  }, []);

  // Effect for AI's turn
  useEffect(() => {
    if (!isUserTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, gameStatus, board]);

  // Initialize the game with random first player
  const initGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus('playing');
    
    // Randomly decide who goes first
    const userGoesFirst = Math.random() >= 0.5;
    setIsUserTurn(userGoesFirst);
    
    // Set player symbols (X always goes first in Tic Tac Toe)
    if (userGoesFirst) {
      setUserPlayer('X');
      setAiPlayer('O');
      setMessage('Your turn! You are X');
    } else {
      setUserPlayer('O');
      setAiPlayer('X');
      setMessage('AI is thinking... You are O');
    }
    
    setIsLoading(false);
  };

  // Handle user's move
  const handleCellClick = (index: number) => {
    // Ignore if cell is already filled, not user's turn, or game is over
    if (board[index] || !isUserTurn || gameStatus !== 'playing') {
      return;
    }

    // Update the board
    const newBoard = [...board];
    newBoard[index] = userPlayer;
    setBoard(newBoard);
    
    // Check for win or draw
    const gameResult = checkGameResult(newBoard, userPlayer);
    if (gameResult !== 'playing') {
      handleGameEnd(gameResult);
      return;
    }
    
    // Switch to AI's turn
    setIsUserTurn(false);
    setMessage('AI is thinking...');
  };

  // AI move using minimax algorithm
  const makeAiMove = () => {
    if (gameStatus !== 'playing') return;

    // Find the best move for AI
    const bestMove = findBestMove(board);
    
    if (bestMove !== -1) {
      const newBoard = [...board];
      newBoard[bestMove] = aiPlayer;
      setBoard(newBoard);
      
      // Check for win or draw
      const gameResult = checkGameResult(newBoard, aiPlayer);
      if (gameResult !== 'playing') {
        handleGameEnd(gameResult);
        return;
      }
      
      // Switch to user's turn
      setIsUserTurn(true);
      setMessage('Your turn!');
    }
  };

  // Find best move using minimax algorithm
  const findBestMove = (currentBoard: Board): number => {
    // If this is the first move and AI goes first, pick a corner or center
    if (currentBoard.every(cell => cell === null)) {
      const firstMoveOptions = [0, 2, 4, 6, 8];
      return firstMoveOptions[Math.floor(Math.random() * firstMoveOptions.length)];
    }
    
    let bestScore = -Infinity;
    let bestMove = -1;
    
    // Try each empty cell
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        // Make a move
        const newBoard = [...currentBoard];
        newBoard[i] = aiPlayer;
        
        // Calculate score using minimax
        const score = minimax(newBoard, 0, false);
        
        // If better score, update best move
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  };

  // Minimax algorithm for AI
  const minimax = (currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    // Check terminal states
    const userWin = checkWinner(currentBoard, userPlayer);
    const aiWin = checkWinner(currentBoard, aiPlayer);
    const isDraw = currentBoard.every(cell => cell !== null);
    
    if (aiWin) return 10 - depth;
    if (userWin) return depth - 10;
    if (isDraw) return 0;
    
    if (isMaximizing) {
      // AI's turn (maximizing)
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = aiPlayer;
          const score = minimax(newBoard, depth + 1, false);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      // User's turn (minimizing)
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = userPlayer;
          const score = minimax(newBoard, depth + 1, true);
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Check if a player has won
  const checkWinner = (currentBoard: Board, player: Player): boolean => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    return winPatterns.some(pattern => 
      pattern.every(index => currentBoard[index] === player)
    );
  };

  // Check game result
  const checkGameResult = (currentBoard: Board, lastPlayer: Player): GameStatus => {
    // Check for win
    if (checkWinner(currentBoard, lastPlayer)) {
      return lastPlayer === userPlayer ? 'win' : 'loss';
    }
    
    // Check for draw
    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return 'playing';
  };

  // Handle game end
  const handleGameEnd = (result: GameStatus) => {
    setGameStatus(result);
    
    switch (result) {
      case 'win':
        setMessage('You won! 🎉');
        break;
      case 'loss':
        setMessage('AI won! Better luck next time.');
        break;
      case 'draw':
        setMessage('It\'s a draw!');
        break;
    }
    
    // Notify parent component about game result
    if (result !== 'playing') {
      onGameComplete(result);
    }
  };

  // Render a cell
  const renderCell = (index: number) => {
    const cell = board[index];
    return (
      <button
        className={`w-full h-full flex items-center justify-center text-4xl font-bold rounded-md 
                  ${cell === null && isUserTurn && gameStatus === 'playing' 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' 
                    : 'cursor-default'
                  }
                  ${cell === 'X' ? 'text-blue-600 dark:text-blue-400' : ''}
                  ${cell === 'O' ? 'text-red-600 dark:text-red-400' : ''}
                  transition-colors duration-200`}
        onClick={() => handleCellClick(index)}
        disabled={cell !== null || !isUserTurn || gameStatus !== 'playing'}
        aria-label={`Cell ${index + 1} ${cell || 'empty'}`}
      >
        {cell}
      </button>
    );
  };

  // Play again button
  const handlePlayAgain = () => {
    initGame();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {message}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          You are playing as {userPlayer}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 aspect-square mb-4">
        {Array(9).fill(null).map((_, index) => (
          <div 
            key={index} 
            className="aspect-square bg-white dark:bg-gray-700 shadow-sm rounded-md border border-gray-200 dark:border-gray-600"
          >
            {renderCell(index)}
          </div>
        ))}
      </div>
      
      {gameStatus !== 'playing' && (
        <div className="text-center mt-4">
          <button
            onClick={handlePlayAgain}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;