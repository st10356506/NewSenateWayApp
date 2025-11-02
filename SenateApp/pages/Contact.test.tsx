import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from './Contact';
import * as emailjs from 'emailjs-com';
import { ref, push } from 'firebase/database';

// Mock Firebase
vi.mock('../firebaseConfig', () => ({
  database: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  push: vi.fn(() => Promise.resolve({ key: 'test-key' })),
}));

// Mock EmailJS
vi.mock('emailjs-com', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

// Mock window.gtag for analytics
const mockGtag = vi.fn();
global.window.gtag = mockGtag;

/**
 * Test Suite for Contact component
 * 
 * TDD Approach:
 * 1. RED: Write tests for form interactions
 * 2. GREEN: Verify form implementation
 * 3. REFACTOR: Improve form if needed
 */
describe('Contact component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGtag.mockClear();
  });

  describe('Form rendering', () => {
    it('should render all form fields', () => {
      // Arrange & Act
      render(<Contact />);

      // Assert: All required fields should be present
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      // Arrange & Act
      render(<Contact />);

      // Assert
      expect(screen.getByRole('button', { name: /send booking request/i })).toBeInTheDocument();
    });
  });

  describe('Form input handling - handleChange', () => {
    it('should update name field when user types', () => {
      // Arrange
      render(<Contact />);
      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;

      // Act
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      // Assert
      expect(nameInput.value).toBe('John Doe');
    });

    it('should update email field when user types', () => {
      // Arrange
      render(<Contact />);
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;

      // Act
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Assert
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update phone field when user types', () => {
      // Arrange
      render(<Contact />);
      const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;

      // Act
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });

      // Assert
      expect(phoneInput.value).toBe('1234567890');
    });

    it('should update guests field when user types', () => {
      // Arrange
      render(<Contact />);
      const guestsInput = screen.getByLabelText(/number of guests/i) as HTMLInputElement;

      // Act
      fireEvent.change(guestsInput, { target: { value: '2' } });

      // Assert
      expect(guestsInput.value).toBe('2');
    });

    it('should update message field when user types', () => {
      // Arrange
      render(<Contact />);
      const messageInput = screen.getByLabelText(/special requests/i) as HTMLTextAreaElement;

      // Act
      fireEvent.change(messageInput, { target: { value: 'Test message' } });

      // Assert
      expect(messageInput.value).toBe('Test message');
    });

    it('should update multiple fields independently', () => {
      // Arrange
      render(<Contact />);
      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;

      // Act
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });

      // Assert
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect(phoneInput.value).toBe('1234567890');
    });
  });

  describe('Form submission - handleSubmit', () => {
    it('should prevent form submission with empty required fields', () => {
      // Arrange
      render(<Contact />);
      const form = document.querySelector('form');
      const submitButton = screen.getByRole('button', { name: /send booking request/i });

      // Act: HTML5 validation should prevent submission
      fireEvent.click(submitButton);

      // Assert: Form should not submit (browser validation)
      expect(form).toBeInTheDocument();
      // Check that Firebase push was not called (form validation prevents submission)
      expect(push).not.toHaveBeenCalled();
    });

    it('should submit form with valid data', async () => {
      // Arrange
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      
      render(<Contact />);
      
      // Fill in all required fields
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const phoneInput = screen.getByLabelText(/phone number/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);
      const checkInInput = screen.getByLabelText(/check-in date/i);
      const checkOutInput = screen.getByLabelText(/check-out date/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '1234567890' } });
      fireEvent.change(guestsInput, { target: { value: '2' } });
      fireEvent.change(checkInInput, { target: { value: '2025-12-01' } });
      fireEvent.change(checkOutInput, { target: { value: '2025-12-05' } });

      // Act: Submit form
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Should call Firebase push
      await waitFor(() => {
        expect(push).toHaveBeenCalled();
      });
    });

    it('should save data to Firebase on submit', async () => {
      // Arrange
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      
      render(<Contact />);
      
      const formData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        guests: '3',
        checkIn: '2025-12-01',
        checkOut: '2025-12-05',
        message: 'Test message',
      };

      // Fill form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: formData.name } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: formData.email } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: formData.phone } });
      fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: formData.guests } });
      fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: formData.checkIn } });
      fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: formData.checkOut } });
      fireEvent.change(screen.getByLabelText(/special requests/i), { target: { value: formData.message } });

      // Act
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Should save to Firebase with correct structure
      await waitFor(() => {
        expect(push).toHaveBeenCalled();
        const callArgs = vi.mocked(push).mock.calls[0];
        expect(callArgs[1]).toMatchObject({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          message: formData.message,
          status: 'pending',
        });
      });
    });

    it('should send email via EmailJS on successful submission', async () => {
      // Arrange
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      
      render(<Contact />);
      
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        guests: '2',
        checkIn: '2025-12-01',
        checkOut: '2025-12-05',
        message: 'Test',
      };

      // Fill form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: formData.name } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: formData.email } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: formData.phone } });
      fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: formData.guests } });
      fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: formData.checkIn } });
      fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: formData.checkOut } });

      // Act
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Should call EmailJS
      await waitFor(() => {
        expect(emailjs.default.send).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      // Arrange
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      
      render(<Contact />);
      
      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      
      expect(nameInput.value).toBe('John Doe');

      // Act
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Form should reset after successful submission
      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });

    it('should track analytics event on submission', async () => {
      // Arrange
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      
      render(<Contact />);
      
      // Fill minimal required fields
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
      fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-02' } });

      // Act
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Should track analytics event
      await waitFor(() => {
        expect(mockGtag).toHaveBeenCalledWith(
          'event',
          'booking_request_submitted',
          expect.objectContaining({
            event_category: 'engagement',
            event_label: 'contact_form',
          })
        );
      });
    });
  });

  describe('Error handling', () => {
    it('should handle Firebase errors gracefully', async () => {
      // Arrange: Mock Firebase to throw error
      const mockFirebaseRef = {};
      vi.mocked(ref).mockReturnValue(mockFirebaseRef as any);
      vi.mocked(push).mockRejectedValueOnce(new Error('Firebase error'));

      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      render(<Contact />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/check-in date/i), { target: { value: '2025-12-01' } });
      fireEvent.change(screen.getByLabelText(/check-out date/i), { target: { value: '2025-12-02' } });

      // Act
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Assert: Should show error alert
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('error')
        );
      });

      alertSpy.mockRestore();
    });
  });
});

