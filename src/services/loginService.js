import axios from 'axios';
/**
 * Login Service
 * Handles authentication API calls
 */
class LoginService {
    apiUrl;
    constructor() {
        this.apiUrl = 'https://api.example.com/auth';
    }
    /**
     * Attempt to login with username and password
     * @param {string} username - The username
     * @param {string} password - The password
     * @returns {Promise<LoginResponse>} Login response with user data and token
     */
    async login(username, password) {
        try {
            const response = await axios.post(`${this.apiUrl}/login`, {
                username,
                password
            });
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            // Handle different error scenarios
            if (error.response) {
                const { status, data } = error.response;
                // Account locked out
                if (status === 423) {
                    return {
                        success: false,
                        error: 'locked_out',
                        message: data.message || 'Your account has been locked due to too many failed login attempts.'
                    };
                }
                // Invalid credentials
                if (status === 401) {
                    return {
                        success: false,
                        error: 'invalid_credentials',
                        message: data.message || 'Invalid username or password.'
                    };
                }
                // Server error
                if (status >= 500) {
                    return {
                        success: false,
                        error: 'server_error',
                        message: data.message || 'Server error. Please try again later.'
                    };
                }
            }
            // Network error or other issues
            return {
                success: false,
                error: 'network_error',
                message: 'Network error. Please check your connection and try again.'
            };
        }
    }
    /**
     * Check if a user account is locked
     * @param {string} username - The username to check
     * @returns {Promise<AccountStatus>} Lock status
     */
    async checkAccountStatus(username) {
        try {
            const response = await axios.get(`${this.apiUrl}/status/${username}`);
            return {
                isLocked: response.data.isLocked,
                lockReason: response.data.lockReason
            };
        }
        catch (error) {
            return {
                isLocked: false,
                error: 'Unable to check account status'
            };
        }
    }
}
export default new LoginService();
//# sourceMappingURL=loginService.js.map