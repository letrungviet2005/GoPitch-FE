import { Navigate, Outlet } from "react-router";

const AdminGuard = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />; 
};
