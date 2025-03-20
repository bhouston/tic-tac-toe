import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '../../test/utils';
import WelcomePage from './page';

// Mock the fetch function
global.fetch = vi.fn();

describe('WelcomePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1', name: 'Test User', email: 'test@example.com' }),
    });
  });

  it('renders the welcome page correctly', () => {
    render(<WelcomePage />);
    
    // Check if title is rendered
    expect(screen.getByText('Welcome to Tic Tac Toe!')).toBeInTheDocument();
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Playing/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    const { user } = render(<WelcomePage />);
    
    // Submit the form without filling it
    await user.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Check if error message is displayed
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const { user } = render(<WelcomePage />);
    
    // Fill name but provide invalid email
    await user.type(screen.getByLabelText(/Your Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Start Playing/i });
    fireEvent.click(submitButton);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const { user, mockRouter } = render(<WelcomePage />);
    
    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/Your Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check if fetch was called with the right arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Test User', email: 'test@example.com' }),
      });
      
      // Check if router.push was called to navigate to the game page
      expect(mockRouter.push).toHaveBeenCalledWith('/game');
    });
  });

  it('shows error message when API request fails', async () => {
    // Mock failed fetch response
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to register user' }),
    });
    
    const { user } = render(<WelcomePage />);
    
    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/Your Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to register user')).toBeInTheDocument();
    });
  });
});