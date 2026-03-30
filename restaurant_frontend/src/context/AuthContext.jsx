import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('admin_refresh_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios instance with interceptors
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true;
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          const newToken = res.data.access;
          setToken(newToken);
          localStorage.setItem('admin_token', newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      const { access, refresh } = res.data;
      setToken(access);
      setRefreshToken(refresh);
      localStorage.setItem('admin_token', access);
      localStorage.setItem('admin_refresh_token', refresh);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Xatolik yuz berdi' };
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, user, loading, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
