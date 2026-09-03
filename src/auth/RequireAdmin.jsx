import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Same caveat as RequireAuth: a UX guard, not the security boundary.
 * /Search and /Admin call admin-only endpoints; the backend rejects a
 * non-admin token regardless of what this component does.
 */
export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, memberNo } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to={`/Profile/${memberNo}`} replace />;
  }
  return children;
}
