# Step-by-Step TDD Implementation Guide

This guide walks you through implementing unit tests using Test-Driven Development (TDD) for the Senate App project.

## Prerequisites

✅ Your project already has:
- Vitest configured (`vitest` package)
- React Testing Library (`@testing-library/react`)
- Test environment setup (`jsdom`)

## Step-by-Step Process

### Step 1: Choose What to Test

Identify the functionality you want to test. Good candidates:
- ✅ Pure functions (like `cn()` in `lib/utils.ts`)
- ✅ Custom hooks (like `useRating()`)
- ✅ Component methods/event handlers
- ✅ Business logic functions

**Example**: Let's test the `cn()` utility function first (simplest case).

---

### Step 2: Write Your First Failing Test (RED)

1. Create a test file next to your source file:
   - Source: `lib/utils.ts`
   - Test: `lib/utils.test.ts`

2. Write a simple test using the AAA pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge multiple class names', () => {
    // Arrange: Set up test data
    const class1 = 'px-4';
    const class2 = 'py-2';

    // Act: Execute the function
    const result = cn(class1, class2);

    // Assert: Verify the expected outcome
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });
});
```

3. Run the test to see it fail (if implementation doesn't exist yet):
```bash
npm test
```

**Expected**: Test should run and you'll see what the function currently returns vs. what you expect.

---

### Step 3: Run the Test (RED Phase)

```bash
# Run tests once
npm test

# Or run in watch mode (recommended)
npm run test:watch
```

**What to look for**:
- ✅ Test runs without syntax errors
- ✅ Test fails with a clear error message
- ✅ Error shows what was expected vs. what was received

---

### Step 4: Implement Minimum Code (GREEN Phase)

1. Look at the test failure message
2. Write the **minimum code** to make the test pass
3. Don't worry about perfect implementation yet

**Example**: If `cn()` doesn't exist or returns wrong value, implement:

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

4. Run the test again:
```bash
npm test
```

**Expected**: Test should now pass ✅

---

### Step 5: Add More Test Cases

Once your first test passes, add more edge cases:

1. **Write failing test** (RED):
```typescript
it('should handle empty input', () => {
  // Arrange
  
  // Act
  const result = cn();
  
  // Assert
  expect(result).toBeDefined();
});
```

2. **Run test** (should fail or pass depending on implementation)

3. **Adjust code if needed** (GREEN)

4. **Repeat** for more cases:
   - Null/undefined values
   - Array inputs
   - Conditional classes
   - Conflicting Tailwind classes

---

### Step 6: Refactor (REFACTOR Phase)

Once all tests pass:
1. Review your implementation
2. Improve code quality
3. Optimize if needed
4. **Run tests again** to ensure nothing breaks

**Important**: Keep all tests green while refactoring!

---

## Example: Testing a React Component

### Step 1: Create Test File

Create `pages/Contact.test.tsx` next to `pages/Contact.tsx`

### Step 2: Write Failing Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Contact } from './Contact';

describe('Contact component', () => {
  it('should update name field when user types', () => {
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

### Step 3: Run Test

```bash
npm test
```

### Step 4: Verify Implementation

If test passes ✅, your `handleChange` is working correctly!

If test fails ❌, check the `Contact.tsx` component implementation.

---

## Example: Testing Custom Hooks

### Step 1: Create Test File

Create `hooks/useRating.test.ts`

### Step 2: Mock Dependencies

```typescript
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../firebaseConfig', () => ({
  database: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
}));
```

### Step 3: Write Test

```typescript
import { renderHook, waitFor } from '@testing-library/react';

describe('useRating hook', () => {
  it('should calculate average rating correctly', async () => {
    // Arrange: Mock Firebase response
    
    // Act
    const { result } = renderHook(() => useRating());
    
    // Wait for async operation
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Assert
    expect(result.current.averageRating).toBeGreaterThan(0);
  });
});
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (Recommended)
```bash
npm run test:watch
```
This re-runs tests when files change - perfect for TDD!

### Run Tests with Coverage
```bash
npm run test:coverage
```
Shows which code is covered by tests.

---

## Quick Reference: AAA Pattern

Every test should have:

```typescript
it('should do something specific', () => {
  // ARRANGE: Set up
  const input = 'test data';
  const expected = 'expected result';
  
  // ACT: Execute
  const result = myFunction(input);
  
  // ASSERT: Verify
  expect(result).toBe(expected);
});
```

---

## Common Testing Patterns

### Testing Form Inputs
```typescript
// Arrange
render(<MyForm />);
const input = screen.getByLabelText(/email/i);

// Act
fireEvent.change(input, { target: { value: 'test@example.com' } });

// Assert
expect(input).toHaveValue('test@example.com');
```

### Testing Button Clicks
```typescript
// Arrange
render(<MyComponent />);
const button = screen.getByRole('button', { name: /submit/i });

// Act
fireEvent.click(button);

// Assert
expect(mockFunction).toHaveBeenCalled();
```

### Testing Async Operations
```typescript
// Arrange
const { result } = renderHook(() => useMyHook());

// Act & Assert (with wait)
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### Testing Error Cases
```typescript
it('should handle errors gracefully', async () => {
  // Arrange: Mock to throw error
  vi.mocked(myFunction).mockRejectedValueOnce(new Error('Test error'));
  
  // Act
  const result = await myFunction();
  
  // Assert
  expect(result.error).toBeDefined();
});
```

---

## Next Steps

1. **Start simple**: Test utility functions first
2. **Add complexity**: Move to components and hooks
3. **Cover edge cases**: Test error scenarios
4. **Maintain**: Keep tests updated as code changes

## Troubleshooting

### Tests not running?
- Check `vite.config.ts` has test configuration
- Ensure test files end with `.test.ts` or `.test.tsx`
- Verify `package.json` has test script

### Import errors?
- Mock external dependencies (Firebase, EmailJS, etc.)
- Use `vi.mock()` for module mocking

### Async test issues?
- Use `waitFor()` from `@testing-library/react`
- Ensure proper `await` for promises

---

## Example Workflow

```
1. Write test for new feature → RED ❌
2. Run test → See failure
3. Write minimum code → GREEN ✅
4. Add more test cases → Some may fail
5. Fix implementation → All GREEN ✅
6. Refactor code → Keep GREEN ✅
7. Commit with confidence! 🎉
```

Happy Testing! 🚀

