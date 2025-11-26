# Stylelink Testing Guide - Phase 3

## Overview

This document outlines the testing infrastructure, philosophy, and best practices for the Stylelink application.

## Testing Philosophy

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Write tests that resemble how users interact** - Use Testing Library's user-centric queries
3. **Prefer integration tests** - Test components in context with their dependencies
4. **Keep tests maintainable** - Clear, readable tests are better than clever ones

## Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Writing Your First Test

```tsx
import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const { userEvent } = await import('../test/test-utils');
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Test Structure

### File Organization

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # Component tests next to components
├── pages/
│   ├── HomePage.tsx
│   └── HomePage.test.tsx
├── hooks/
│   ├── useAccessControl.ts
│   └── useAccessControl.test.ts
├── utils/
│   ├── accessControl.ts
│   └── accessControl.test.ts
└── test/
    ├── setup.ts             # Global test setup
    └── test-utils.tsx       # Custom render & utilities
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Spec tests: `*.spec.ts` or `*.spec.tsx`

## Coverage Requirements

| Metric     | Threshold |
|------------|-----------|
| Branches   | 70%       |
| Functions  | 70%       |
| Lines      | 80%       |
| Statements | 80%       |

Run `npm run test:coverage` to generate a coverage report.

## Testing Utilities

### Custom Render

Use our custom render function that includes necessary providers:

```tsx
import { render, screen } from '../test/test-utils';

// Renders with BrowserRouter
render(<MyComponent />);

// Renders with specific route
render(<MyComponent />, { initialEntries: ['/profile/123'] });
```

### Mock Data Generators

```tsx
import { createMockUser, createMockAppUser, createMockAuthContext } from '../test/test-utils';

// Create a mock Firebase user
const mockUser = createMockUser({ displayName: 'John Doe' });

// Create a mock app user
const mockAppUser = createMockAppUser({ userType: 'seller' });

// Create mock auth context
const mockAuth = createMockAuthContext({ currentUser: mockUser });
```

### User Interactions

```tsx
import { userEvent } from '../test/test-utils';

it('handles user input', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
});
```

## Best Practices

### 1. Query Priority

Use queries in this order (most to least preferred):

1. `getByRole` - Accessible queries (buttons, links, headings)
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Input placeholders
4. `getByText` - Text content
5. `getByTestId` - Last resort (add `data-testid` attribute)

### 2. Async Testing

```tsx
// ✅ Good - wait for elements
await screen.findByText('Success');

// ✅ Good - use waitFor for assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Bad - synchronous query for async content
screen.getByText('Success'); // May fail if content loads async
```

### 3. Mocking

```tsx
// Mock a module
vi.mock('../services/apiService', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' }),
}));

// Mock a function
const mockFn = vi.fn();

// Spy on a method
vi.spyOn(console, 'error').mockImplementation(() => {});
```

### 4. Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

it('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### 5. Snapshot Testing (Use Sparingly)

```tsx
it('matches snapshot', () => {
  const { container } = render(<Button>Click</Button>);
  expect(container).toMatchSnapshot();
});
```

## Common Patterns

### Testing Forms

```tsx
it('submits form with valid data', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  
  render(<ContactForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@example.com',
  });
});
```

### Testing Navigation

```tsx
import { render, screen } from '../test/test-utils';

it('navigates to profile on click', async () => {
  const user = userEvent.setup();
  
  render(<NavBar />, { initialEntries: ['/'] });
  
  await user.click(screen.getByRole('link', { name: /profile/i }));
  
  expect(window.location.pathname).toBe('/profile');
});
```

### Testing Error States

```tsx
it('displays error message on API failure', async () => {
  vi.mocked(apiService.fetchData).mockRejectedValue(new Error('Network error'));
  
  render(<DataComponent />);
  
  await screen.findByText(/network error/i);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});
```

### Testing Loading States

```tsx
it('shows loading spinner while fetching', async () => {
  vi.mocked(apiService.fetchData).mockImplementation(
    () => new Promise(() => {}) // Never resolves
  );
  
  render(<DataComponent />);
  
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

## Debugging Tests

### Debug Output

```tsx
import { screen } from '../test/test-utils';

// Print the current DOM
screen.debug();

// Print a specific element
screen.debug(screen.getByRole('button'));
```

### Testing Playground

```tsx
import { screen } from '../test/test-utils';

// Get suggested queries
screen.logTestingPlaygroundURL();
```

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Push to main branch
- Pre-commit hooks (if configured)

Coverage reports are generated and should be reviewed to ensure thresholds are met.

## Troubleshooting

### Common Issues

1. **"Unable to find element"** - Element may not be rendered yet. Use `findBy` queries or `waitFor`.

2. **"Not wrapped in act(...)"** - State updates happening outside of act. Wrap async operations in `waitFor`.

3. **Mock not working** - Ensure mocks are defined before imports. Use `vi.mock()` at the top of the file.

4. **Tests passing locally but failing in CI** - Check for timing issues, missing environment variables, or platform-specific behavior.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

