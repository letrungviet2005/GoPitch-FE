import { Navigate, Outlet } from "react-router";

const AdminGuard = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // if (user.role !== 'ADMIN') return <Navigate to="/403" />;

  return <Outlet />; 
};
