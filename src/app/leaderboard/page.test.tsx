import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor } from '../../test/utils';
import LeaderboardPage from './page';

describe('LeaderboardPage', () => {
  it('renders the leaderboard page with loading state initially', () => {
    render(<LeaderboardPage />);
    
    // Check if title is rendered
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    
    // Check if loading message is displayed initially
    expect(screen.getByText('Loading leaderboard data...')).toBeInTheDocument();
  });

  it('displays construction message after loading', async () => {
    render(<LeaderboardPage />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.getByText('Leaderboard is under construction. Coming soon!')).toBeInTheDocument();
    });
  });

  it('navigates back to welcome page when button is clicked', async () => {
    const { user, mockRouter } = render(<LeaderboardPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading leaderboard data...')).not.toBeInTheDocument();
    });
    
    // Click the back button
    await user.click(screen.getByRole('button', { name: /Back to Welcome Page/i }));
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/welcome');
  });
});