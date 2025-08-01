// src/layouts/AppLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Adjust the import path as necessary

const AppLayoutClient = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AppLayoutClient;
