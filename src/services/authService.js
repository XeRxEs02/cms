import apiService from './apiService';

class AuthService {
  /**
   * Login with username and password
   */
  async login(username, password) {
    try {
      if (!username || !password) {
        return { 
          success: false, 
          error: 'Username and password are required' 
        };
      }

      const response = await apiService.post('/api/v1/auth/login', {
        username,
        password,
      });

      if (response.access_token) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Get user info
        const userInfo = await this.getUserInfo();
        return { success: true, user: userInfo };
      }
      
      return { 
        success: false, 
        error: 'Invalid response from server' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed';
      if (error.message.includes('Invalid user credentials')) {
        errorMessage = 'Invalid username or password';
      } else if (error.message.includes('authentication_failed')) {
        errorMessage = 'Authentication service unavailable';
      } else if (error.message.includes('missing_credentials')) {
        errorMessage = 'Username and password are required';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Logout user and clear tokens
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await apiService.post('/api/v1/auth/logout', {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Always clear local storage
      this.clearTokens();
    }
  }

  /**
   * Clear all authentication tokens and user data
   */
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedProject');
  }

  /**
   * Get user information from server
   */
  async getUserInfo() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await apiService.get('/api/v1/auth/userinfo');
      return response;
      
    } catch (error) {
      console.error('Error fetching user info:', error);
      
      // If token is invalid, clear it
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        this.clearTokens();
      }
      
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await apiService.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        return response.access_token;
      }
      
      throw new Error('Invalid refresh response');
      
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens if refresh fails
      this.clearTokens();
      throw error;
    }
  }
}

export default new AuthService();
