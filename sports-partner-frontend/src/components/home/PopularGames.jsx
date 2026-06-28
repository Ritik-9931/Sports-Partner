import React from "react";
import {
  Trophy,
  ArrowRight,
} from "lucide-react";

const games = [
  {
    name: "Chess",
    icon: "♟️",
    players: "1,250 Players",
    color: "from-slate-700 to-slate-900",
  },
  {
    name: "Badminton",
    icon: "🏸",
    players: "980 Players",
    color: "from-green-500 to-emerald-700",
  },
  {
    name: "Football",
    icon: "⚽",
    players: "1,540 Players",
    color: "from-blue-500 to-indigo-700",
  },
  {
    name: "Cricket",
    icon: "🏏",
    players: "2,200 Players",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Carrom",
    icon: "🎯",
    players: "760 Players",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Table Tennis",
    icon: "🏓",
    players: "890 Players",
    color: "from-cyan-500 to-blue-600",
  },
];

const PopularGames = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            Popular Games
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Discover Trending Games
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Join thousands of players actively looking
            for partners in their favorite sports and
            indoor games.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Top */}
              <div
                className={`h-2 bg-gradient-to-r ${game.color}`}
              ></div>

              <div className="p-8">
                {/* Icon */}
                <div className="flex items-center justify-between">
                  <div className="text-5xl">
                    {game.icon}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Trophy
                      size={22}
                      className="text-blue-600"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 mt-6">
                  {game.name}
                </h3>

                {/* Players */}
                <p className="text-gray-500 mt-2">
                  {game.players}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-3xl font-bold text-blue-600">
              5K+
            </h3>
            <p className="text-gray-600 mt-2">
              Active Players
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-3xl font-bold text-green-600">
              25+
            </h3>
            <p className="text-gray-600 mt-2">
              Games Available
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-3xl font-bold text-purple-600">
              100+
            </h3>
            <p className="text-gray-600 mt-2">
              Communities
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-3xl font-bold text-orange-600">
              50+
            </h3>
            <p className="text-gray-600 mt-2">
              Cities Covered
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PopularGames;

