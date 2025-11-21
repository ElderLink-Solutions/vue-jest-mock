// Mock the login service FIRST before any imports
jest.mock('../src/services/loginService.js');

import LoginForm from '../src/components/LoginForm';
import loginService from '../src/services/loginService.js';

describe('LoginForm Component', () => {
  let component;

  beforeEach(() => {
    // Clear all mocks and reset the login function
    jest.clearAllMocks();
    loginService.login = jest.fn();

    // Create component instance with mock emit
    component = {
      ...LoginForm,
      data() {
        return {
          username: '',
          password: '',
          loading: false,
          error: null,
          success: false
        };
      },
      $emit: jest.fn()
    };
  });

  it('should initialize with correct default state', () => {
    const data = LoginForm.data();
    expect(data.username).toBe('');
    expect(data.password).toBe('');
    expect(data.loading).toBe(false);
    expect(data.error).toBe(null);
    expect(data.success).toBe(false);
  });

  it('should handle successful login', async () => {
    // Mock successful login
    loginService.login.mockResolvedValue({
      success: true,
      data: {
        user: { id: 1, username: 'testuser' },
        token: 'mock-token'
      }
    });

    // Set form data
    component.username = 'testuser';
    component.password = 'password123';

    // Bind methods to component
    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);

    // Call login
    await boundHandleLogin();

    expect(loginService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(component.success).toBe(true);
    expect(component.error).toBe(null);
    expect(component.loading).toBe(false);
    expect(component.$emit).toHaveBeenCalledWith('login-success', expect.objectContaining({
      user: { id: 1, username: 'testuser' },
      token: 'mock-token'
    }));
  });

  it('should handle invalid credentials error', async () => {
    // Mock failed login
    loginService.login.mockResolvedValue({
      success: false,
      error: 'invalid_credentials',
      message: 'Invalid username or password.'
    });

    component.username = 'wronguser';
    component.password = 'wrongpass';

    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);
    await boundHandleLogin();

    expect(component.success).toBe(false);
    expect(component.error).toBe('Invalid username or password.');
    expect(component.loading).toBe(false);
    expect(component.$emit).toHaveBeenCalledWith('login-error', 'invalid_credentials');
  });

  it('should handle locked out account', async () => {
    // Mock locked account response
    loginService.login.mockResolvedValue({
      success: false,
      error: 'locked_out',
      message: 'Your account has been locked due to too many failed login attempts.'
    });

    component.username = 'lockeduser';
    component.password = 'password123';

    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);
    await boundHandleLogin();

    expect(component.success).toBe(false);
    expect(component.error).toContain('locked');
    expect(component.loading).toBe(false);
    expect(component.$emit).toHaveBeenCalledWith('login-error', 'locked_out');
  });

  it('should handle network error', async () => {
    // Mock network error
    loginService.login.mockResolvedValue({
      success: false,
      error: 'network_error',
      message: 'Network error. Please check your connection and try again.'
    });

    component.username = 'testuser';
    component.password = 'password123';

    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);
    await boundHandleLogin();

    expect(component.success).toBe(false);
    expect(component.error).toContain('Network error');
    expect(component.loading).toBe(false);
    expect(component.$emit).toHaveBeenCalledWith('login-error', 'network_error');
  });

  it('should handle server error', async () => {
    // Mock server error
    loginService.login.mockResolvedValue({
      success: false,
      error: 'server_error',
      message: 'Server error. Please try again later.'
    });

    component.username = 'testuser';
    component.password = 'password123';

    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);
    await boundHandleLogin();

    expect(component.success).toBe(false);
    expect(component.error).toContain('Server error');
    expect(component.loading).toBe(false);
  });

  it('should set loading state during login', async () => {
    // Mock a delayed response
    loginService.login.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: { user: {}, token: 'token' }
          });
        }, 10);
      });
    });

    component.username = 'testuser';
    component.password = 'password123';

    const boundHandleLogin = LoginForm.methods.handleLogin.bind(component);
    const loginPromise = boundHandleLogin();
    
    // Check loading state is true during the request
    expect(component.loading).toBe(true);

    await loginPromise;

    // Check loading state is false after completion
    expect(component.loading).toBe(false);
  });

  it('should clear form data', () => {
    // Set some data
    component.username = 'testuser';
    component.password = 'password123';
    component.error = 'Some error';
    component.success = true;

    // Clear form
    const boundClearForm = LoginForm.methods.clearForm.bind(component);
    boundClearForm();

    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe(null);
    expect(component.success).toBe(false);
  });
});
