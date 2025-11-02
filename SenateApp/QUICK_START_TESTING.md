# Quick Start: Writing Unit Tests with TDD

This project now has a complete testing setup following Test-Driven Development (TDD) principles with the AAA (Arrange, Act, Assert) pattern.

## ✅ What's Already Set Up

1. **Test Configuration** (`vite.config.ts`)
   - Vitest with React Testing Library
   - jsdom environment for DOM testing
   - Coverage reporting enabled

2. **Test Setup File** (`src/test-setup.ts`)
   - Automatic cleanup after tests
   - Jest DOM matchers configured

3. **Example Tests Created**
   - ✅ `lib/utils.test.ts` - Testing utility functions
   - ✅ `App.test.tsx` - Testing React components
   - ✅ `hooks/useRating.test.ts` - Testing custom hooks
   - ✅ `pages/Contact.test.tsx` - Testing form interactions

## 🚀 How to Run Tests

```bash
# Run all tests once
npm test

# Run in watch mode (recommended for TDD)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

## 📝 How to Write Your First Test (TDD)

### Step 1: Create a Test File

If testing `pages/MyComponent.tsx`, create `pages/MyComponent.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should do something', () => {
    // Test code here
  });
});
```

### Step 2: Write a Failing Test (RED)

```typescript
it('should display user name', () => {
  // Arrange
  const userName = 'John Doe';
  render(<MyComponent name={userName} />);
  
  // Act
  const nameElement = screen.getByText('John Doe');
  
  // Assert
  expect(nameElement).toBeInTheDocument();
});
```

### Step 3: Run Test

```bash
npm run test:watch
```

**Expected**: Test should fail (RED ❌) if feature doesn't exist

### Step 4: Implement Feature (GREEN)

Write minimum code to make test pass:

```typescript
export function MyComponent({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

**Expected**: Test should pass (GREEN ✅)

### Step 5: Refactor (if needed)

Improve code while keeping tests green.

## 📚 Test Examples in This Project

### 1. Testing Utility Functions (`lib/utils.test.ts`)

**What it tests**: The `cn()` function for merging CSS classes

**Key patterns**:
- Testing basic functionality
- Testing edge cases (null, undefined, empty strings)
- Testing with arrays and objects

### 2. Testing React Components (`App.test.tsx`)

**What it tests**: Component rendering and structure

**Key patterns**:
- Using `render()` from React Testing Library
- Querying elements with `screen` or `container`
- Verifying DOM structure

### 3. Testing Custom Hooks (`hooks/useRating.test.ts`)

**What it tests**: Hook logic and Firebase integration

**Key patterns**:
- Using `renderHook()` for testing hooks
- Mocking Firebase dependencies
- Testing async operations with `waitFor()`

### 4. Testing Form Interactions (`pages/Contact.test.tsx`)

**What it tests**: Form input handling and submission

**Key patterns**:
- Testing user input with `fireEvent`
- Testing form submission
- Mocking external services (Firebase, EmailJS)
- Testing error handling

## 🎯 AAA Pattern in Action

Every test follows this structure:

```typescript
it('should do something specific', () => {
  // ARRANGE: Set up test data and environment
  const input = 'test data';
  const expected = 'expected result';
  
  // ACT: Execute the code being tested
  const result = myFunction(input);
  
  // ASSERT: Verify the expected outcome
  expect(result).toBe(expected);
});
```

## 🔧 Common Testing Utilities

### Querying Elements

```typescript
// By label text
screen.getByLabelText(/email/i)

// By role
screen.getByRole('button', { name: /submit/i })

// By text
screen.getByText('Hello World')

// Query selector
container.querySelector('form')
```

### User Interactions

```typescript
// Click button
fireEvent.click(button)

// Type in input
fireEvent.change(input, { target: { value: 'text' } })

// Submit form
fireEvent.submit(form)
```

### Async Testing

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### Mocking

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('./firebaseConfig', () => ({
  database: {},
}));

// Mock function
const mockFn = vi.fn();
vi.mocked(myFunction).mockReturnValue('mocked value');
```

## 📖 Additional Resources

- **TDD_GUIDE.md** - Comprehensive TDD explanation
- **TDD_STEP_BY_STEP.md** - Detailed step-by-step instructions
- Test files in the project - Real working examples

## 🎓 Best Practices

1. ✅ Write tests before or alongside code (TDD)
2. ✅ One test, one behavior
3. ✅ Use descriptive test names
4. ✅ Test behavior, not implementation
5. ✅ Keep tests isolated and independent
6. ✅ Mock external dependencies
7. ✅ Test edge cases and error scenarios

## 🐛 Troubleshooting

**Tests not running?**
- Check file ends with `.test.ts` or `.test.tsx`
- Verify `package.json` has test script

**Import errors?**
- Mock external dependencies with `vi.mock()`
- Check test setup file is configured

**Async issues?**
- Use `waitFor()` for async operations
- Ensure proper `await` for promises

---

**Ready to test!** Start by running existing tests, then write your own following the examples. 🚀

