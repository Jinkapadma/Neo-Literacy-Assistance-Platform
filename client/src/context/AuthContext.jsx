import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi.js';
import { setAccessToken } from '../api/axiosInstance.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate session on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.refresh();
      if (response?.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch {
      // Session expired or not logged in
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [checkAuth]);

  const login = async credentials => {
    try {
      const res = await authApi.login(credentials);
      if (res?.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return res.data.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(msg);
      throw error;
    }
  };

  const register = async data => {
    try {
      const res = await authApi.register(data);
      if (res?.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        toast.success('Account created successfully! Welcome to NeoRead.');
        return res.data.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue clearing local state
    } finally {
      setAccessToken(null);
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await authApi.getProfile();
      if (res?.data) {
        setUser(res.data);
      }
    } catch {
      // Error handling
    }
  };

  const updateProfile = async updatedData => {
    try {
      const res = await authApi.updateProfile(updatedData);
      if (res?.data) {
        setUser(res.data);
        toast.success('Profile updated successfully!');
        return res.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
