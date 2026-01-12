import { Navigate, Outlet } from "react-router";

const AdminGuard = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  // Nếu không có token, đá về trang login ngay lập tức
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Ở đây ông có thể check thêm Role nếu trong token hoặc logic BE có phân quyền
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // if (user.role !== 'ADMIN') return <Navigate to="/403" />;

  return <Outlet />; // Cho phép vào các route con
};
