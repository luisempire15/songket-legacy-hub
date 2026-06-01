import { useState } from "react";
import { useApp } from "../context/AppContext";
import { AuthService } from "../services/AuthService";
import { User, UmkmApplication } from "../types";

export function useAuthController() {
  const { user, setUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.login({ email, password });
      if (res.success) {
        setUser(res.user);
        return res.user;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Email atau password salah");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.register(userData);
      if (res.success) {
        setUser(res.user);
        return res.user;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const applyUmkm = async (appData: Partial<UmkmApplication>): Promise<UmkmApplication | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.applyUmkm(appData);
      if (res.success) {
        return res.application;
      }
      return null;
    } catch (err: any) {
      setError(err.message || "Failed to apply for UMKM");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    applyUmkm,
  };
}
