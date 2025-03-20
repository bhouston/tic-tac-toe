import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import GamePage from './page';

describe('GamePage', () => {
  it('renders the game page with loading message initially', () => {
    render(<GamePage />);
    
    // Check if title is rendered
    expect(screen.getByText('Tic Tac Toe Game')).toBeInTheDocument();
    
    // Check if loading message is displayed initially
    expect(screen.getByText('Loading game...')).toBeInTheDocument();
  });

  it('updates message after useEffect runs', async () => {
    render(<GamePage />);
    
    // Wait for the useEffect to run and update the message
    await waitFor(() => {
      expect(screen.getByText('Game page is under construction. Coming soon!')).toBeInTheDocument();
    });
  });

  it('navigates back to welcome page when button is clicked', async () => {
    const { user, mockRouter } = render(<GamePage />);
    
    // Click the back button
    await user.click(screen.getByRole('button', { name: /Back to Welcome Page/i }));
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/welcome');
  });
});