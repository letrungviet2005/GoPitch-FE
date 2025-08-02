// src/layouts/AppLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Adjust the import path as necessary
import Footer from "./Footer"; // Adjust the import path as necessary

const AppLayoutClient = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayoutClient;
