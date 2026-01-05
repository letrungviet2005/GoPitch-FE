import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Home from "./pages/Admin/Dashboard/Home";
import Pitch from "./pages/Client/Pitch/Pitch";
import AppLayoutClient from "./pages/Client/layout/AppLayoutClient";

import HomePage from "./pages/Client/HomePage/HomePage";
import DetailPitch from "./pages/Client/DetailPitch/DetailPitch";
import BookingPitch from "./pages/Client/BookingPitch/BookingPitch";
import Booked from "./pages/Client/Booked/Booked";
import SignInForm from "./components/auth/SignInForm";
import Payment from "./pages/Client/Payment/Payment";
import Profile from "./pages/Client/Profile/Profile";
import authecintication from "./authentication/authentication";
import PaymentResult from "./pages/Client/Payment/PaymentResult/PaymentResult";
import BookingHistory from "./pages/Client/BookingHistory/BookingHistory";
import { useEffect } from "react";
import { handleAndStoreLocation } from "./hooks/locationHandler";
import Maps from "./pages/Client/Maps/ClubMap";
import SignUp from "./components/auth/SignUpForm";

export default function App() {
  useEffect(() => {
    // Tự động hỏi vị trí khi vào app
    handleAndStoreLocation();
  }, []);
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/admin" element={<Home />} />

            {/* Others Page */}
          </Route>

          <Route element={<AppLayoutClient />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/pitch" element={<Pitch />} />
            <Route path="/bookingpitch/:id" element={<BookingPitch />} />
            <Route path="/payment" element={<Payment />} />
            {/* Thêm 2 dòng này */}
            <Route path="/payment-success" element={<PaymentResult />} />
            <Route path="/payment-failed" element={<PaymentResult />} />
            <Route path="/booked" element={<Booked />} />

            <Route path="maps" element={<Maps />} />

            {/* Booking Pitch Page */}
            <Route path="/detailpitch/:id" element={<DetailPitch />} />
            <Route path="/booking-history" element={<BookingHistory />} />

            {/* Others Page */}
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
