import React from "react";
import { Navigate } from "react-router-dom";

const OTPProtectedRoute = ({ children }) => {
  const isVerified = localStorage.getItem("otpVerified");

  if (!isVerified) {
    return <Navigate to="otp-generate" />;
  }

  return children;
};

export default OTPProtectedRoute;