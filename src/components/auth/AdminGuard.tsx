import { Navigate, Outlet } from "react-router";

export const AdminGuard = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />; 
};
