import loginService from '../loginService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          },
          token: 'mock-jwt-token-123'
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await loginService.login('testuser', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        'https://api.example.com/auth/login',
        {
          username: 'testuser',
          password: 'password123'
        }
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponse.data);
      }
    });

    it('should handle invalid credentials (401 error)', async () => {
      // Mock 401 unauthorized response
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Invalid username or password.'
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await loginService.login('wronguser', 'wrongpass');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('invalid_credentials');
        expect(result.message).toBe('Invalid username or password.');
      }
    });

    it('should handle locked out account (423 error)', async () => {
      // Mock 423 locked response
      const mockError = {
        response: {
          status: 423,
          data: {
            message: 'Your account has been locked due to too many failed login attempts.'
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await loginService.login('lockeduser', 'password123');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('locked_out');
        expect(result.message).toContain('locked');
      }
    });

    it('should handle server error (500 error)', async () => {
      // Mock 500 server error response
      const mockError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error.'
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await loginService.login('testuser', 'password123');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('server_error');
        expect(result.message).toBe('Internal server error.');
      }
    });

    it('should handle network error', async () => {
      // Mock network error (no response from server)
      const mockError = {
        message: 'Network Error',
        code: 'ERR_NETWORK'
      };
      
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await loginService.login('testuser', 'password123');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('network_error');
        expect(result.message).toContain('Network error');
      }
    });

    it('should use default error message when response data message is missing', async () => {
      // Mock error without message in data
      const mockError = {
        response: {
          status: 401,
          data: {}
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);

      const result = await loginService.login('testuser', 'password123');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('Invalid username or password.');
      }
    });
  });

  describe('checkAccountStatus', () => {
    it('should return account status when not locked', async () => {
      // Mock successful status check
      const mockResponse = {
        data: {
          isLocked: false,
          lockReason: null
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await loginService.checkAccountStatus('testuser');

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.example.com/auth/status/testuser'
      );
      expect(result.isLocked).toBe(false);
    });

    it('should return locked status for locked account', async () => {
      // Mock locked account status
      const mockResponse = {
        data: {
          isLocked: true,
          lockReason: 'Too many failed login attempts'
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await loginService.checkAccountStatus('lockeduser');

      expect(result.isLocked).toBe(true);
      expect(result.lockReason).toBe('Too many failed login attempts');
    });

    it('should handle error when checking account status', async () => {
      // Mock error response
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await loginService.checkAccountStatus('testuser');

      expect(result.isLocked).toBe(false);
      expect(result.error).toBe('Unable to check account status');
    });
  });
});
