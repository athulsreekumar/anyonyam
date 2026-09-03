import "./logout.scss";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  // Calling logout() directly in the render body (the previous
  // implementation) triggers a parent state update while this component
  // is still rendering, which React rejects. Side effects belong in
  // useEffect, not the render path.
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Navigate to="/" replace />;
}
