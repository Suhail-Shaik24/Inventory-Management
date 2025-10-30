import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the Context
const AuthContext = createContext(null);

// Mock user data for different roles
const USER_ROLES = {
  Manager: { name: 'Alex Chen', role: 'Manager', avatar: 'AC' },
  Maker: { name: 'Ben Carter', role: 'Maker', avatar: 'BC' },
  Checker: { name: 'Chloe Davis', role: 'Checker', avatar: 'CD' },
};

/**
 * 3. Create the Provider Component
 * This component will wrap our app and provide auth state and functions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = (role) => {
    const userData = USER_ROLES[role];
    if (userData) {
      setUser(userData);
      navigate('/'); // Redirect to dashboard after login
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  const isAuthenticated = !!user;

  // The value provided to consuming components
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 4. Create a custom hook for easy consumption
 * This lets components just call `useAuth()`
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
