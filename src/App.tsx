import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import "../src/authentication/authentication";
import Home from "./pages/Admin/Dashboard/Home";
import Pitch from "./pages/Client/Pitch/Pitch";
import AppLayoutClient from "./pages/Client/layout/AppLayoutClient";

import HomePage from "./pages/Client/HomePage/HomePage";

export default function App() {
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

            {/* Others Page */}
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
