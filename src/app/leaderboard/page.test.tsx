import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LeaderboardPage from './page';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the fetch function
global.fetch = vi.fn();

describe('LeaderboardPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should show loading state initially', () => {
    // Mock fetch to return a pending promise
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
    
    render(<LeaderboardPage />);
    
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('See how you stack up against other players!')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should display message when no players have completed games', async () => {
    // Mock fetch to return empty array
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);
    
    render(<LeaderboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No players have completed any games yet. Be the first to play!')).toBeInTheDocument();
    });
  });

  it('should display leaderboard data when available', async () => {
    // Mock sample leaderboard data
    const mockData = [
      {
        id: '1',
        name: 'Player 1',
        stats: {
          totalGames: 10,
          wins: 7,
          losses: 2,
          draws: 1,
          winPercentage: 70,
        },
        score: 7070,
      },
      {
        id: '2',
        name: 'Player 2',
        stats: {
          totalGames: 5,
          wins: 2,
          losses: 2,
          draws: 1,
          winPercentage: 40,
        },
        score: 4005,
      },
    ];
    
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);
    
    render(<LeaderboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getByText('Player 2')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    // Mock fetch to fail
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to fetch' }),
    } as Response);
    
    render(<LeaderboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Could not load the leaderboard. Please try again later.')).toBeInTheDocument();
    });
  });
});