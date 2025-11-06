import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API_BASE_URL = 'https://05644f2f1d43.ngrok-free.app';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Extract user data and token from response
      const { access_token, token_type, user: userData } = data;
      const token = access_token; // Use access_token from API response
      const user = userData || {
        id: Date.now(),
        email: email,
        firstName: email.split('@')[0], // Extract username from email
        lastName: 'User'
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user: user, token: token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Extract user data and token from response
      const { access_token, token_type, user: responseUser } = data;
      const token = access_token; // Use access_token from API response
      const user = responseUser || {
        id: Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user: user, token: token };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};