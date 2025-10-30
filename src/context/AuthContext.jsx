import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Create Context ---
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app to provide authentication state and functions.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // --- Login Function ---
    // Now accepts a user object, which will be provided by the login page after its API call
    const login = (userData) => {
        setUser(userData);
        // Note: Navigation is now handled by the LoginPage on successful login
    };

    // --- Logout Function ---
    const logout = () => {
        setUser(null);
        navigate('/login'); // Redirect to login page after logout
    };

    const isAuthenticated = !!user;

    // --- Context Value ---
    const value = {
        user,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Custom Hook
 * A simple hook for components to consume the auth context.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

