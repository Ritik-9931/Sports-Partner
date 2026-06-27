import React, { useState } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";

const OTPSystem = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (loading) return;

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/sendOTP", { email });
      alert(res.data.message);
      setStep(2);
    } catch (error) {
      console.error("sendOTP error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const res = await api.post("/auth/verifyOTP", {
        email,
        otp,
      });

      alert(res.data.message);

      localStorage.setItem("otpVerified", "true");

      navigate("/updatePass", {
        state: { email },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">
            OTP Verification
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Secure password recovery system
          </p>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 tracking-widest"
              />
            </div>

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          OTP expires in 5 minutes for security.
        </p>
      </div>
    </div>
  );
};

export default OTPSystem;