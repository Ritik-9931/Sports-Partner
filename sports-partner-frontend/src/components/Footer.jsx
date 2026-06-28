import React from "react";
import { Link } from "react-router-dom";
import {
LuFacebook,
LuInstagram,
LuMail,
LuMapPin,
LuPhone,
LuTwitter
} from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">SportsMate</h2>

            <p className="text-sm leading-6">
              Find sports partners nearby, join matches, participate in events,
              and grow your sports community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/partners" className="hover:text-blue-400 transition">
                  Find Partners
                </Link>
              </li>

              <li>
                <Link to="/games" className="hover:text-blue-400 transition">
                  Games
                </Link>
              </li>

              <li>
                <Link to="/communities" className="hover:text-blue-400 transition">
                  Events
                </Link>
              </li>

              <li>
                <Link to="/profile" className="hover:text-blue-400 transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Sports
            </h3>

            <ul className="space-y-2">
              <li>Cricket</li>
              <li>Football</li>
              <li>Badminton</li>
              <li>Basketball</li>
              <li>Table Tennis</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <LuMail size={16} />
                sportpartner54@gmail.com
              </div>

              <div className="flex items-center gap-2">
                <LuMapPin size={16} />
                Bihar, India
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <a href="#" className="hover:text-blue-400 transition">
            <LuFacebook />
          </a>

          <a href="#" className="hover:text-pink-400 transition">
            <LuInstagram />
          </a>

          <a href="#" className="hover:text-sky-400 transition">
            <LuTwitter />
          </a>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} SportsMate. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
