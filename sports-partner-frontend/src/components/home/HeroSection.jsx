import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Trophy, Search } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../service/api";

const HeroSection = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/users/homeStates");
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-600 text-white">
      {/* Background Blur Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
              🏆 India's Sports Partner Network
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Find Sports &
              <span className="block text-yellow-300">
                Indoor Game Partners
              </span>
              Near You
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              Connect with nearby players for Chess, Carrom, Badminton, Cricket,
              Football, Table Tennis and many more games.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
              >
                <Search size={18} />
                Find Players
              </Link>

              <Link
                to="/communities"
                className="inline-flex items-center gap-2 border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                <Users size={18} />
                Join Community
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div>
                <h3 className="text-3xl font-bold">{stats.totalUsers || 0}+</h3>{" "}
                <p className="text-blue-100">Players</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">{stats.totalGames || 0}+</h3>{" "}
                <p className="text-blue-100">Games</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {stats.totalCommunities || 0}+
                </h3>{" "}
                <p className="text-blue-100">Communities</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "🎲",
                name: "Ludo",
                players: "1,200 Active Players",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: "🎯",
                name: "Carrom",
                players: "950 Active Players",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "🏓",
                name: "Table Tennis",
                players: "640 Active Players",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "⚽",
                name: "Football",
                players: "1,500 Active Players",
                color: "from-purple-500 to-pink-500",
              },
            ].map((game) => (
              <div
                key={game.name}
                className={`bg-gradient-to-br ${game.color} rounded-2xl p-5 shadow-xl text-white transform transition duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{game.icon}</span>

                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    🎮
                  </div>
                </div>

                <h4 className="mt-4 text-lg font-bold">{game.name}</h4>

                <p className="mt-1 text-sm text-white/80">{game.players}</p>

                <div className="mt-4 h-1 w-full rounded-full bg-white/20">
                  <div className="h-1 w-3/4 rounded-full bg-white"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
