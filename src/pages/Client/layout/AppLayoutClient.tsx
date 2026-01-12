import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const AppLayoutClient = () => {
  return (
    // min-h-screen và flex-col giúp footer luôn nằm dưới cùng nếu nội dung ngắn
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      {/* Dùng flex-1 để main chiếm hết không gian còn lại.
          Sẽ không bị đè nếu Header dùng sticky.
      */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AppLayoutClient;
