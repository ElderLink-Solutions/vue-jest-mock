import { defineComponent } from 'vue';
import loginService from '../services/loginService.js';

/**
 * Login Component
 * A simple login form that uses the LoginService
 */
export default defineComponent({
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: null as string | null,
      success: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      this.success = false;

      const result = await loginService.login(this.username, this.password);
      
      this.loading = false;
      
      if (result.success) {
        this.success = true;
        this.$emit('login-success', result.data);
      } else {
        this.error = result.message;
        this.$emit('login-error', result.error);
      }
    },
    
    clearForm() {
      this.username = '';
      this.password = '';
      this.error = null;
      this.success = false;
    }
  }
});
