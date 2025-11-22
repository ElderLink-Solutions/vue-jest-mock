/**
 * Example Usage of Login Service and Component
 *
 * This file demonstrates how the LoginService and LoginForm
 * can be used in a real application.
 */
import loginService from './services/loginService.js';
import LoginForm from './components/LoginForm.js';
// Example 1: Using the Login Service directly
async function exampleDirectServiceUsage() {
    console.log('=== Example 1: Direct Service Usage ===');
    // Successful login
    const successResult = await loginService.login('validuser', 'correctpassword');
    if (successResult.success) {
        console.log('Login successful!');
        console.log('User data:', successResult.data.user);
        console.log('Token:', successResult.data.token);
    }
    // Failed login
    const failedResult = await loginService.login('invaliduser', 'wrongpassword');
    if (!failedResult.success) {
        console.log('Login failed:', failedResult.message);
        console.log('Error type:', failedResult.error);
    }
}
// Example 2: Checking account status
async function exampleCheckAccountStatus() {
    console.log('=== Example 2: Check Account Status ===');
    const status = await loginService.checkAccountStatus('testuser');
    if (status.isLocked) {
        console.log('Account is locked!');
        console.log('Reason:', status.lockReason);
    }
    else {
        console.log('Account is active');
    }
}
// Example 3: Using the LoginForm Component in Vue
const exampleVueUsage = {
    template: `
    <div class="login-page">
      <h1>Login</h1>
      <login-form
        @login-success="handleLoginSuccess"
        @login-error="handleLoginError"
      />
    </div>
  `,
    components: {
        LoginForm
    },
    methods: {
        handleLoginSuccess(userData) {
            console.log('User logged in successfully:', userData);
            // Redirect to dashboard or save token
            localStorage.setItem('authToken', userData.token);
            // this.$router.push('/dashboard');
        },
        handleLoginError(errorType) {
            console.log('Login error occurred:', errorType);
            switch (errorType) {
                case 'locked_out':
                    alert('Your account has been locked. Please contact support.');
                    break;
                case 'invalid_credentials':
                    alert('Invalid username or password. Please try again.');
                    break;
                case 'network_error':
                    alert('Network error. Please check your internet connection.');
                    break;
                case 'server_error':
                    alert('Server error. Please try again later.');
                    break;
                default:
                    alert('An unexpected error occurred.');
            }
        }
    }
};
// Example 4: Programmatic login with error handling
async function exampleLoginWithRetry(username, password, maxRetries = 3) {
    console.log('=== Example 4: Login with Retry Logic ===');
    let attempts = 0;
    while (attempts < maxRetries) {
        attempts++;
        console.log(`Attempt ${attempts}/${maxRetries}...`);
        const result = await loginService.login(username, password);
        if (result.success) {
            console.log('Login successful on attempt', attempts);
            return result.data;
        }
        // Don't retry on certain errors
        if (result.error === 'locked_out' || result.error === 'invalid_credentials') {
            console.log('Login failed, no retry:', result.message);
            throw new Error(result.message);
        }
        // Retry on network/server errors
        if (attempts < maxRetries) {
            console.log('Retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }
    }
    throw new Error('Login failed after maximum retries');
}
// Example 5: Multiple scenarios demonstration
export async function demonstrateAllScenarios() {
    console.log('\n=== Demonstrating All Login Scenarios ===\n');
    // These are just examples - in a real app, these would call the actual API
    console.log('Scenario 1: Successful Login');
    console.log('- User provides correct credentials');
    console.log('- Server returns 200 with user data and token');
    console.log('- Application stores token and redirects to dashboard\n');
    console.log('Scenario 2: Invalid Credentials (401)');
    console.log('- User provides incorrect username or password');
    console.log('- Server returns 401 Unauthorized');
    console.log('- Application displays error message\n');
    console.log('Scenario 3: Locked Out Account (423)');
    console.log('- User account has been locked due to too many failed attempts');
    console.log('- Server returns 423 Locked');
    console.log('- Application displays lockout message and support contact\n');
    console.log('Scenario 4: Network Error');
    console.log('- Network connection is unavailable or unstable');
    console.log('- Request fails without reaching server');
    console.log('- Application displays network error message\n');
    console.log('Scenario 5: Server Error (500)');
    console.log('- Server experiences internal error');
    console.log('- Server returns 500 Internal Server Error');
    console.log('- Application displays server error message and suggests retry\n');
}
export { exampleDirectServiceUsage, exampleCheckAccountStatus, exampleVueUsage, exampleLoginWithRetry };
//# sourceMappingURL=examples.js.map