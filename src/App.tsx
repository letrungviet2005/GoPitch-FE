import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import "./App.css";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
          </Route>
          {/* Other Routes */}
        </Routes>
      </Router>
    </>
  );
}
