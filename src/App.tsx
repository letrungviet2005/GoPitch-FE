import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { handleAndStoreLocation } from "./hooks/locationHandler";

// Import Layouts & Common
import AppLayout from "./layout/AppLayout";
import AppLayoutClient from "./pages/Client/layout/AppLayoutClient";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Import Pages (Admin)
import Home from "./pages/Admin/Dashboard/Home";
import Club from "./pages/Admin/Club/Club";
import Pitches from "./pages/Admin/Pitch/Pitch";
import Revenue from "./pages/Admin/Revenue/Revenue";
import ClubAdd from "./pages/Admin/Club/ClubAdd/ClubAdd";
import ClubUpdate from "./pages/Admin/Club/ClubUpdate/ClubUpdate";

// Import Pages (Client)
import HomePage from "./pages/Client/HomePage/HomePage";
import Pitch from "./pages/Client/Pitch/Pitch";
import DetailPitch from "./pages/Client/DetailPitch/DetailPitch";
import BookingPitch from "./pages/Client/BookingPitch/BookingPitch";
import Booked from "./pages/Client/Booked/Booked";
import Payment from "./pages/Client/Payment/Payment";
import PaymentResult from "./pages/Client/Payment/PaymentResult/PaymentResult";
import BookingHistory from "./pages/Client/BookingHistory/BookingHistory";
import Profile from "./pages/Client/Profile/Profile";
import Maps from "./pages/Client/Maps/ClubMap";
import ChatBot from "./pages/Client/ChatBot/ChatBot";
import ContactPage from "./pages/Client/Contact/Contact";

// Import Auth & Other
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./components/auth/SignUpForm";
import NotFound from "./pages/OtherPage/NotFound";

// COMPONENT BẢO VỆ ROUTE
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole"); // Hãy đảm bảo bạn lưu role vào đây khi Login thành công

  if (!token) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(role || "")) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default function App() {
  useEffect(() => {
    handleAndStoreLocation();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ================= ADMIN & OWNER ROUTES (BỊ KHÓA) ================= */}
        <Route element={<ProtectedRoute allowedRoles={["Admin", "Owner"]} />}>
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="clubs" element={<Club />} />
            <Route path="pitch" element={<Pitches />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="clubs/add" element={<ClubAdd />} />
            <Route path="clubs/details/:id" element={<ClubUpdate />} />
          </Route>
        </Route>

        <Route element={<AppLayoutClient />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/pitch" element={<Pitch />} />
          <Route path="/detailpitch/:id" element={<DetailPitch />} />
          <Route path="/bookingpitch/:id" element={<BookingPitch />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentResult />} />
          <Route path="/payment-failed" element={<PaymentResult />} />
          <Route path="/booked" element={<Booked />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="contact" element={<ContactPage />} />

          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ChatBot hiển thị toàn app */}
      <div className="min-h-screen bg-white">
        <ChatBot />
      </div>
    </Router>
  );
}
