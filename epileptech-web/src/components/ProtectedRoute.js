import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated, loginPath }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the return path
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;