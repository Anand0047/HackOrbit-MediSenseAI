import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Clean up invalid tokens on mount
  useEffect(() => {
    if (token) {
      try {
        jwtDecode(token);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    jwtDecode(token); // Just to check validity
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}