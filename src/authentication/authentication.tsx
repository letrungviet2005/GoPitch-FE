import { Navigate, Outlet } from "react-router-dom";

// Component kiểm tra quyền
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  const userRole = localStorage.getItem("userRole");

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(userRole || "")) {
    // Nếu có token nhưng sai quyền, đẩy về trang chủ hoặc 404
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
