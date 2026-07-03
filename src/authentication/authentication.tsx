import { Navigate, Outlet } from "react-router-dom";
import { normalizeRole } from "../services/authService";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const userRole = normalizeRole(localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || undefined);

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
