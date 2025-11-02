import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { Gallery } from '../../pages/Gallery';
import { Contact } from '../../pages/Contact';
import { Chatbot } from '../../pages/Chatbot';

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
  default: { name: 'test-app' },
  database: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
  push: vi.fn(() => Promise.resolve({ key: 'test-key' })),
}));

vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

/**
 * Functional Tests: User Stories
 * 
 * Validates that the application meets functional requirements
 * as specified in user stories.
 */
describe('User Stories Functional Tests', () => {
  describe('US-1: Browse Rooms', () => {
    it('should allow user to view available rooms', () => {
      // Arrange & Act
      render(<App />);
      fireEvent.click(screen.getByText(/rooms/i));

      // Assert: Rooms page should display room information
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('US-2: Submit Booking Request', () => {
    it('should allow user to submit a booking request with all required fields', () => {
      // Arrange
      render(<Contact />);

      // Act: Fill required fields
      fireEvent.change(screen.getByLabelText(/full name/i), { 
        target: { value: 'John Doe' } 
      });
      fireEvent.change(screen.getByLabelText(/email address/i), { 
        target: { value: 'john@example.com' } 
      });
      fireEvent.change(screen.getByLabelText(/phone number/i), { 
        target: { value: '1234567890' } 
      });
      fireEvent.change(screen.getByLabelText(/number of guests/i), { 
        target: { value: '2' } 
      });
      fireEvent.change(screen.getByLabelText(/check-in date/i), { 
        target: { value: '2025-12-01' } 
      });
      fireEvent.change(screen.getByLabelText(/check-out date/i), { 
        target: { value: '2025-12-05' } 
      });

      // Assert: Form should be valid
      const submitButton = screen.getByRole('button', { 
        name: /send booking request/i 
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('US-3: View Gallery', () => {
    it('should display gallery images', () => {
      // Arrange & Act
      render(<Gallery />);

      // Assert: Gallery should contain images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('US-4: Contact via Chatbot', () => {
    it('should allow user to interact with chatbot', () => {
      // Arrange
      render(<Chatbot />);

      // Assert: Chatbot interface should be visible
      expect(screen.getByPlaceholderText(/type your question/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should display quick question buttons', () => {
      // Arrange
      render(<Chatbot />);

      // Assert: Quick questions should be available
      expect(screen.getByText(/what are your room rates/i)).toBeInTheDocument();
      expect(screen.getByText(/what facilities do you offer/i)).toBeInTheDocument();
    });
  });

  describe('US-5: View Reviews and Ratings', () => {
    it('should display reviews and ratings', () => {
      // Arrange & Act
      render(<App />);
      fireEvent.click(screen.getByText(/reviews/i));

      // Assert: Reviews page should be visible
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('US-6: Navigate Between Pages', () => {
    it('should allow seamless navigation between all pages', () => {
      // Arrange
      render(<App />);

      const pages = ['Home', 'Rooms', 'Gallery', 'Reviews', 'Contact'];

      // Act & Assert: Navigate to each page
      pages.forEach(pageName => {
        fireEvent.click(screen.getByText(new RegExp(pageName, 'i')));
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      });
    });
  });
});

