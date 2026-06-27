import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Eye, EyeOff, Lock } from "lucide-react";
import api from "../service/api";

const UpdateUser = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================
     PROTECT ROUTE
  ========================= */

  useEffect(() => {
    const verified = localStorage.getItem("otpVerified");

    if (!verified || !email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  /* =========================
     UPDATE PASSWORD
  ========================= */

  const updatePassword = async () => {
    if (loading) return;

    if (!password || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.put("/auth/updatePassword", {
        email,
        password,
      });

      alert(res.data.message);

      localStorage.removeItem("otpVerified");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        {/* HEADER */}

        <div className="text-center mb-8">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-orange-500" size={36} />
          </div>

          <h1 className="text-3xl font-bold text-orange-600">
            Update Password
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Create a new secure password
          </p>
        </div>

        {/* EMAIL */}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <div className="w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-600">
            {email}
          </div>
        </div>

        {/* NEW PASSWORD */}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}

        <button
          onClick={updatePassword}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-70"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your password will be updated securely.
        </p>
      </div>
    </div>
  );
};

export default UpdateUser;
