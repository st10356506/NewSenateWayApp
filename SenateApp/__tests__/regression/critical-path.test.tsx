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
  push: vi.fn(() => Promise.resolve({ key: 'test-key' })),
}));

vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200 })),
  },
}));

/**
 * Regression Tests: Critical Path
 * 
 * Tests previously implemented features to ensure
 * they still work after new changes.
 * 
 * Run these tests:
 * - After every commit
 * - Before releases
 * - When refactoring
 */
describe('Regression Tests - Critical Path', () => {
  describe('Navigation Regression', () => {
    it('should still navigate correctly after changes (REG-001)', () => {
      // This test ensures navigation hasn't regressed
      render(<App />);
      
      // Navigate through main pages
      fireEvent.click(screen.getByText(/rooms/i));
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText(/gallery/i));
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText(/contact/i));
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should maintain header and footer on all pages (REG-002)', () => {
      const { container } = render(<App />);
      
      // Check header exists
      expect(container.querySelector('header')).toBeInTheDocument();
      
      // Navigate and verify header still exists
      fireEvent.click(screen.getByText(/rooms/i));
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });

  describe('Form Functionality Regression', () => {
    it('should still validate contact form correctly (REG-003)', () => {
      render(<App />);
      fireEvent.click(screen.getByText(/contact/i));
      
      // Form should be visible
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      
      // Required fields should exist
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('required');
    });
  });

  describe('Component Rendering Regression', () => {
    it('should render all main sections correctly (REG-004)', () => {
      const { container } = render(<App />);
      
      // Header should render
      expect(container.querySelector('header')).toBeInTheDocument();
      
      // Main content should render
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Footer should render
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should handle page state changes correctly (REG-005)', () => {
      render(<App />);
      
      // Initial state
      const initialMain = screen.getByRole('main');
      
      // Change page
      fireEvent.click(screen.getByText(/gallery/i));
      
      // Main should still exist but content changed
      const newMain = screen.getByRole('main');
      expect(newMain).toBeInTheDocument();
    });
  });
});

