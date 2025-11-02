// 'src/context/AuthContext.jsx'
import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // No localStorage; rely on backend cookie
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const { data } = await api.post("/api/auth/token/login", { username, password });
    setUser(data.user || null);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/token/signup", payload);
    setUser(data.user || null);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (roles = []) => {
    if (!user?.role) return false;
    const r = String(user.role).toLowerCase();
    return roles.map((x) => String(x).toLowerCase()).includes(r);
  };

  const value = useMemo(() => ({ user, login, signup, logout, hasRole }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
