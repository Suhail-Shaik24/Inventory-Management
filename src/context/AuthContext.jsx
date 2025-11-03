// 'src/context/AuthContext.jsx'
import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // No localStorage; rely on backend and in-memory token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const applyToken = (tkn) => {
    if (tkn) {
      api.defaults.headers.common["Authorization"] = `Bearer ${tkn}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const login = async (username, password) => {
    const { data } = await api.post("/api/auth/token/login", { username, password });
    const tkn = data?.token || null;
    setToken(tkn);
    applyToken(tkn);
    setUser(data.user || null);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/token/signup", payload);
    const tkn = data?.token || null;
    setToken(tkn);
    applyToken(tkn);
    setUser(data.user || null);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    applyToken(null);
  };

  const hasRole = (roles = []) => {
    if (!user?.role) return false;
    const r = String(user.role).toLowerCase();
    return roles.map((x) => String(x).toLowerCase()).includes(r);
  };

  const refreshMe = async () => {
    try {
      const { data } = await api.get('/api/auth/token/me');
      const u = data?.user || null;
      setUser(u);
      return u;
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  const value = useMemo(() => ({ user, token, login, signup, logout, hasRole, refreshMe }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
