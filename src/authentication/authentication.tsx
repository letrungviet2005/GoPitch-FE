import React from "react";
const accessToken =
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
if (!accessToken) {
  window.location.href = "/signin";
}
