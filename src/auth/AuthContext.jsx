import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { readAuth, writeAuth, clearAuth } from "./authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readAuth);

  const login = useCallback(({ token, role, memberNo, name }) => {
    const next = { token, role, memberNo, name };
    writeAuth(next);
    setAuth(next);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth({ token: null, role: null, memberNo: null, name: null });
  }, []);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      isAdmin: auth.role === "admin",
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
