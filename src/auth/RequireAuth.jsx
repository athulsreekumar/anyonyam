import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Client-side route guard. This is a UX convenience, not a security
 * boundary - the backend enforces authorization independently on every
 * request. Without this, an unauthenticated visitor could sit on
 * /Profile/:id or /Admin looking at a page whose API calls all fail with
 * scattered error alerts instead of being sent straight to /Login.
 */
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}
