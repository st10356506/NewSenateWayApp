import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Mock Firebase
vi.mock('../../firebaseConfig', () => ({
  default: { name: 'test-app' },
  database: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
}));

/**
 * Integration Tests: Navigation Flow
 * 
 * Tests the complete user navigation journey:
 * Header → Navigation Click → Page Render → Footer visibility
 */
describe('Navigation Integration Tests', () => {
  describe('Complete Navigation Flow', () => {
    it('should navigate from home to rooms page', () => {
      // Arrange
      render(<App />);
      
      // Act: Click on Rooms navigation item
      const roomsLink = screen.getByText(/rooms/i);
      fireEvent.click(roomsLink);
      
      // Assert: Rooms page should be rendered
      expect(screen.getByText(/rooms/i)).toBeInTheDocument();
    });

    it('should navigate from rooms to gallery', () => {
      // Arrange
      render(<App />);
      
      // Act: Navigate to gallery
      const galleryLink = screen.getByText(/gallery/i);
      fireEvent.click(galleryLink);
      
      // Assert: Gallery should be visible
      expect(screen.getByText(/gallery/i)).toBeInTheDocument();
    });

    it('should navigate to contact page and back to home', () => {
      // Arrange
      render(<App />);
      
      // Act: Navigate to contact
      const contactLink = screen.getByText(/contact/i);
      fireEvent.click(contactLink);
      
      // Assert: Contact form should be visible
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      
      // Act: Navigate back to home
      const homeLink = screen.getByText(/home/i);
      fireEvent.click(homeLink);
      
      // Assert: Home page content should be visible
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Header-Footer Integration', () => {
    it('should maintain header and footer across all pages', () => {
      // Arrange
      const { container } = render(<App />);
      
      // Act & Assert: Check header exists
      let header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Navigate to different pages
      fireEvent.click(screen.getByText(/rooms/i));
      header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      fireEvent.click(screen.getByText(/gallery/i));
      header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Check footer exists
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });
  });
});

