import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Users,
  Trophy,
  Calendar,
  User,
  LogOut,
  AppWindowMacIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src={
                  user?.profileImage || "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                SportsMate
              </h1>

              <p className="text-xs text-gray-500">Find Your Sports Partner</p>
            </div>
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-3">
            {user?.role === "admin" && (
              <NavLink to="/admin/dashboard" className={navStyle}>
                Admin Panel
              </NavLink>
            )}

            <NavLink to="/" end className={navStyle}>
              Home
            </NavLink>

            <NavLink to="/partners" className={navStyle}>
              <Users size={18} />
              Partners
            </NavLink>

            <NavLink to="/games" className={navStyle}>
              <Trophy size={18} />
              Games
            </NavLink>

            <NavLink to="/communities" className={navStyle}>
              <Calendar size={18} />
              Communities
            </NavLink>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive ? "bg-blue-50 text-blue-600" : ""
                }`
              }
            >
              <img
                src={
                  user?.profileImage || "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border"
              />

              <span className="font-medium">{user?.name}</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <img
                src={
                  user?.profileImage || "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {user?.role === "admin" && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className={navStyle}
              >
                <AppWindowMacIcon size={18} />
                Admin Panel
              </NavLink>
            )}

            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navStyle}
            >
              Home
            </NavLink>

            <NavLink
              to="/partners"
              onClick={() => setMenuOpen(false)}
              className={navStyle}
            >
              <Users size={18} />
              Partners
            </NavLink>

            <NavLink
              to="/games"
              onClick={() => setMenuOpen(false)}
              className={navStyle}
            >
              <Trophy size={18} />
              Games
            </NavLink>

            <NavLink
              to="/communities"
              onClick={() => setMenuOpen(false)}
              className={navStyle}
            >
              <Calendar size={18} />
              Communities
            </NavLink>

            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={navStyle}
            >
              <User size={18} />
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
