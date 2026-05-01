import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Landing from '../Landing';

// A simple wrapper so we don't have to repeat this inside every 'it' block
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const theme = createTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Landing Page', () => {
  
  it('renders the registration form by default', () => {
    render(<Landing />, { wrapper: AllProviders });
    
    // Check for the registration heading
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    // Check for the username field (which only exists in register tab)
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  });

  it('switches to the login form when the Login tab is clicked', () => {
    render(<Landing />, { wrapper: AllProviders });

    // Find and click the login tab
    const loginTab = screen.getByRole('tab', { name: /Login/i });
    fireEvent.click(loginTab);

    // Check for the login heading
    expect(screen.getByText(/Sign in to Chat/i)).toBeInTheDocument();
    // Verify username field is gone (because it's the login tab now)
    expect(screen.queryByLabelText(/Username/i)).not.toBeInTheDocument();
  });
});