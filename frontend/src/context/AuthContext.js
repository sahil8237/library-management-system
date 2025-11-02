import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // Login user
  const login = async (email, password) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('/api/auth/login', body, config);
      const { token, data } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      return { success: false, error };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
