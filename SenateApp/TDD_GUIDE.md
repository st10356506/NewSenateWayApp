# Test-Driven Development (TDD) Guide

## Overview
This guide explains how to write unit tests using the TDD approach with the AAA (Arrange, Act, Assert) pattern.

## TDD Cycle: Red → Green → Refactor

### Step 1: **Red** - Write a Failing Test
Write a test that describes the desired behavior. The test should fail because the functionality doesn't exist yet or isn't implemented correctly.

### Step 2: **Green** - Make the Test Pass
Write the minimum code necessary to make the test pass. Don't worry about perfect code yet.

### Step 3: **Refactor** - Improve the Code
Once the test passes, refactor the code to improve its quality while keeping the test green.

## AAA Pattern Explained

Every test should follow the **AAA (Arrange, Act, Assert)** pattern:

1. **Arrange**: Set up the test data and conditions
   - Initialize variables
   - Mock dependencies
   - Set up the test environment

2. **Act**: Execute the code being tested
   - Call the function/method
   - Trigger the event
   - Perform the action

3. **Assert**: Verify the expected outcome
   - Check the result
   - Verify side effects
   - Ensure correct behavior

## Example: Testing a Utility Function

### Step 1: Write Failing Test (RED)
```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    // Arrange
    const class1 = 'px-4';
    const class2 = 'py-2';
    
    // Act
    const result = cn(class1, class2);
    
    // Assert
    expect(result).toBe('px-4 py-2');
  });
});
```

### Step 2: Run Test (Should FAIL)
```bash
npm test
```

### Step 3: Implement Minimum Code (GREEN)
```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return inputs.join(' '); // Minimal implementation
}
```

### Step 4: Run Test (Should PASS)
```bash
npm test
```

### Step 5: Refactor (if needed)
Improve the implementation while keeping tests green.

## Example: Testing React Hooks

### Step 1: Write Failing Test
```typescript
// hooks/useRating.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRating } from './useRating';

describe('useRating hook', () => {
  it('should calculate average rating correctly', async () => {
    // Arrange - Mock Firebase data
    // Act - Call the hook
    // Assert - Check the average rating
  });
});
```

## Example: Testing React Components

### Step 1: Write Failing Test
```typescript
// pages/Contact.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from './Contact';

describe('Contact component', () => {
  it('should update form input when user types', () => {
    // Arrange
    render(<Contact />);
    const nameInput = screen.getByLabelText(/full name/i);
    
    // Act
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Assert
    expect(nameInput).toHaveValue('John Doe');
  });
});
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for TDD)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Best Practices

1. **One test, one assertion** (when possible)
2. **Test behavior, not implementation**
3. **Use descriptive test names** that explain what is being tested
4. **Keep tests isolated** - each test should be independent
5. **Mock external dependencies** (APIs, Firebase, etc.)
6. **Test edge cases** (empty inputs, null values, etc.)
7. **Test error cases** (network failures, invalid data, etc.)

## What to Test

### ✅ DO Test:
- Pure functions (utils, helpers)
- Business logic
- Component behavior (user interactions)
- Hook logic
- Form validation
- Data transformations

### ❌ DON'T Test:
- Third-party library code
- Implementation details (internal state changes)
- Styling/CSS
- Constants

## Next Steps

1. Review the example tests in the `__tests__` or `*.test.ts` files
2. Write a failing test for a new feature
3. Implement the feature
4. Run tests to verify
5. Refactor if needed

