# vue-jest-mock

A sample project demonstrating how to use mocks with Jest to simulate a login process with different conditions such as being locked out. This project is similar in concept to vue-selenide and vue-playwright, but focuses on unit testing with Jest mocks instead of end-to-end testing.

## 🎯 Live Demo

Open `demo.html` in your browser to see a visual overview of all test scenarios and project features.

## Overview

This project showcases best practices for testing Vue.js applications using Jest with mocked API responses. It demonstrates how to test various authentication scenarios without requiring a real backend server.

## Features

- **Login Service**: A service that handles authentication API calls
- **Vue Component**: A login form component that uses the login service
- **Comprehensive Jest Tests**: Tests covering multiple scenarios:
  - ✅ Successful login
  - ❌ Invalid credentials (401)
  - 🔒 Locked out account (423)
  - 🌐 Network errors
  - 🔧 Server errors (500)
  - 📊 Account status checking

## Project Structure

```
vue-jest-mock/
├── src/
│   ├── services/
│   │   └── loginService.js      # Login API service
│   └── components/
│       └── LoginForm.js          # Vue login form component
├── tests/
│   ├── loginService.spec.js     # Tests for login service with mocks
│   └── LoginForm.spec.js        # Tests for Vue component with mocks
├── jest.config.js               # Jest configuration
├── babel.config.json            # Babel configuration
└── package.json                 # Project dependencies and scripts
```

## Installation

```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Examples

### Mocking Successful Login

```javascript
axios.post.mockResolvedValue({
  data: {
    user: { id: 1, username: 'testuser' },
    token: 'mock-jwt-token'
  }
});

const result = await loginService.login('testuser', 'password123');
expect(result.success).toBe(true);
```

### Mocking Locked Account

```javascript
axios.post.mockRejectedValue({
  response: {
    status: 423,
    data: { message: 'Account locked due to too many failed attempts' }
  }
});

const result = await loginService.login('lockeduser', 'password');
expect(result.error).toBe('locked_out');
```

### Mocking Network Error

```javascript
axios.post.mockRejectedValue({
  message: 'Network Error',
  code: 'ERR_NETWORK'
});

const result = await loginService.login('testuser', 'password');
expect(result.error).toBe('network_error');
```

## Key Testing Concepts

### 1. Mocking Axios

The project uses `jest.mock('axios')` to mock HTTP requests:

```javascript
import axios from 'axios';
jest.mock('axios');

// Mock successful response
axios.post.mockResolvedValue({ data: { ... } });

// Mock error response
axios.post.mockRejectedValue({ response: { status: 401 } });
```

### 2. Testing Different HTTP Status Codes

The login service handles various HTTP status codes:
- **200**: Successful login
- **401**: Invalid credentials
- **423**: Account locked
- **500+**: Server errors
- **No response**: Network errors

### 3. Component Testing with Mocks

The LoginForm component tests demonstrate:
- Mocking service dependencies
- Testing component state changes
- Verifying event emissions
- Testing loading states

## Benefits of Mock Testing

1. **Fast Execution**: No need for real API calls or server setup
2. **Reliability**: Tests are not affected by network issues or server downtime
3. **Controlled Scenarios**: Easy to test edge cases and error conditions
4. **Isolation**: Each test is independent and doesn't affect others
5. **Cost-Effective**: No need for test environments or API quotas

## Comparison with Other Testing Approaches

| Approach | Speed | Setup | Real API | Use Case |
|----------|-------|-------|----------|----------|
| **Jest Mocks** (this project) | ⚡ Fast | Simple | ❌ | Unit testing business logic |
| **vue-selenide** | 🐢 Slower | Complex | ✅ | E2E testing with real backend |
| **vue-playwright** | 🐢 Slower | Complex | ✅ | E2E testing with real backend |

## License

MIT

## Contributing

Feel free to submit issues and pull requests to improve this example project.