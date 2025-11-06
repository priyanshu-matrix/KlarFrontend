import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

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
      // Simulate API call - replace with your actual API endpoint
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Mock successful login
          resolve({
            user: {
              id: 1,
              email: email,
              firstName: 'John',
              lastName: 'Doe'
            },
            token: 'mock-jwt-token-' + Date.now()
          });
        }, 1000);
      });

      const { user: userData, token } = response;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
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
      // Simulate API call - replace with your actual API endpoint
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Mock successful signup
          resolve({
            user: {
              id: Date.now(),
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName
            },
            token: 'mock-jwt-token-' + Date.now()
          });
        }, 1000);
      });

      const { user: newUser, token } = response;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);

      // Update state
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
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