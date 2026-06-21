import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Trophy } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700"></div>

      {/* Blur Effects */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">
        ⚽
      </div>

      <div className="absolute top-32 right-16 text-5xl opacity-20 animate-pulse">
        🏸
      </div>

      <div className="absolute bottom-16 left-20 text-5xl opacity-20 animate-bounce">
        ♟️
      </div>

      <div className="absolute bottom-20 right-20 text-5xl opacity-20 animate-pulse">
        🏓
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full mb-6">
          <Trophy size={18} />
          <span className="font-medium">
            Join India's Growing Sports Network
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Ready To Start
          <span className="block text-yellow-300">Playing Today?</span>
        </h2>

        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mt-6">
          Discover sports partners, join communities, participate in
          tournaments, and make new friends through your favorite games.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
          >
            Add Community
            <ArrowRight size={20} />
          </Link>

          <Link
            to="/partners"
            className="inline-flex items-center gap-2 border-2 border-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
          >
            <Users size={20} />
            Find Players
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
