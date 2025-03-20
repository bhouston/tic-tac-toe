# Testing Documentation

This project uses Vitest for testing React components and application logic. The testing setup is designed to work with Next.js, TypeScript, and React.

## Testing Libraries

- **Vitest**: Main test runner and framework
- **@testing-library/react**: For rendering and testing React components
- **@testing-library/jest-dom**: For additional DOM matchers
- **@testing-library/user-event**: For simulating user interactions
- **happy-dom**: For providing a DOM environment for tests

## Test Structure

Tests are organized following the same structure as the application code:

- Component tests are placed next to the components they test with a `.test.tsx` extension
- Utility function tests are placed next to the utility files they test with a `.test.ts` extension

## Running Tests

The following npm scripts are available for running tests:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI (if vitest-ui is installed)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Utilities

Test utilities are available in `src/test/utils.tsx`. These include:

- Custom render function that includes necessary providers and mocks
- Mocks for Next.js router, Image component, and other dependencies
- Helper functions for common testing patterns

## Writing Tests

When writing tests, follow these guidelines:

1. Test component rendering and appearance
2. Test user interactions and component behavior
3. Test error states and edge cases
4. Mock external dependencies (API calls, etc.)
5. Use descriptive test names that explain what is being tested

Example test structure:

```tsx
describe('ComponentName', () => {
  it('renders correctly', () => {
    // Test rendering
  });

  it('handles user interaction', async () => {
    // Test interaction
  });

  it('shows error state when appropriate', () => {
    // Test error state
  });
});
```

## Mocking

The testing setup includes mocks for:

- Next.js router (`useRouter`, `usePathname`, `useSearchParams`)
- Next.js Image component
- Fetch API

To mock additional dependencies, add them to the appropriate test file or to `src/test/utils.tsx` if they are used across multiple tests.

## Coverage Reports

Coverage reports are generated in HTML, JSON, and text formats. The HTML report can be found in `coverage/index.html` after running `npm run test:coverage`.