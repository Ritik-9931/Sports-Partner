import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    city: "",
    state: "",
    locationPrivacy: "hidden",
    liveTrackingEnabled: false,
  });

  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => console.log(err)
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("latitude", latitude);
      data.append("longitude", longitude);

      if (image) {
        data.append("profileImage", image);
      }

      await dispatch(registerUser(data)).unwrap();
      alert("Register Successful");
      navigate("/");
    } catch (error) {
      alert(error || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-100">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Create Account 🚀
          </h2>
          <p className="text-gray-500 mt-2">
            Join and find your sports partners
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-300 outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-300 outline-none"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-300 outline-none"
            required
          />

          {/* Row inputs */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="px-3 py-3 rounded-xl border"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="px-3 py-3 rounded-xl border"
            />
          </div>

          {/* City / State */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="px-3 py-3 rounded-xl border"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="px-3 py-3 rounded-xl border"
            />
          </div>

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-2 rounded-xl"
          />

          {/* Location Privacy */}
          <select
            name="locationPrivacy"
            value={formData.locationPrivacy}
            onChange={handleChange}
            className="w-full px-3 py-3 rounded-xl border"
          >
            <option value="hidden">Hide My Location</option>
            <option value="distance_only">Show Distance Only</option>
            <option value="live_location">Share Live Location</option>
          </select>

          {/* Checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={formData.liveTrackingEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  liveTrackingEnabled: e.target.checked,
                })
              }
            />
            Enable Live Tracking
          </label>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;