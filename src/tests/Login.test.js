import { render, screen } from '@testing-library/react';
import Login from '../components/Login';

describe('Login component', () => {
    test('renders banner logo', () => {
        render(<Login />);
        const bannerLogo = screen.getByAltText('banner logo');
        expect(bannerLogo).toBeInTheDocument();
      });
    
      test('renders Google login button', () => {
        render(<Login />);
        const googleButton = screen.getByText(/Sign in with Google/i);
        expect(googleButton).toBeInTheDocument();
      });
    
      test('renders demo login button', () => {
        render(<Login />);
        const demoButton = screen.getByText(/Sign in as Demo User/i);
        expect(demoButton).toBeInTheDocument();
      });
    
      test('does not render message initially', () => {
        render(<Login />);
        const message = screen.queryByText(/To proceed, sign in./i);
        expect(message).toBeNull();
      });
    
      test('renders message when user is not logged in', () => {
        render(<Login currentUser={null} />);
        const message = screen.getByText(/To proceed, sign in./i);
        expect(message).toBeInTheDocument();
      });

  // Add more tests for error handling and message display.
});
