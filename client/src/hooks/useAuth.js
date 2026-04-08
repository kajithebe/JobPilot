/**
 * useAuth HOOK
 * ─────────────────────────────────────────────────────────────
 * Handles login, register and logout logic.
 * Uses react-hot-toast for success/error notifications.
 *
 * BACKEND: Expects both token AND user object in response data:
 * {
 *   success: true,
 *   data: {
 *     token: string,
 *     user: { id, name, email }
 *   }
 * }
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, logoutUser } from '../services/auth.service.js';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      // BACKEND: response must include data.token and data.user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      // BACKEND: return { success: false, error: "message" } for failures
      const message = err.response?.data?.error || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      // BACKEND: response must include data.token and data.user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      // BACKEND: 401 for wrong credentials, 400 for missing fields
      const message = err.response?.data?.error || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch {
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return { register, login, logout, loading };
};
