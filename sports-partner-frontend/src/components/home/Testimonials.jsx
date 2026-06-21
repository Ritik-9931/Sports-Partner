import React from "react";
import {
  Star,
  Quote,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ritik Raushan",
    role: "Chess Player",
    image:
      "https://ui-avatars.com/api/?name=Ritik+Raushan&background=2563eb&color=fff",
    rating: 5,
    review:
      "SportsMate helped me find multiple chess partners nearby. Now I play regularly and have improved my rating significantly.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Badminton Enthusiast",
    image:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff",
    rating: 5,
    review:
      "I struggled to find badminton partners before. Within a week of joining, I connected with an active community in my city.",
  },
  {
    id: 3,
    name: "Aman Kumar",
    role: "Football Player",
    image:
      "https://ui-avatars.com/api/?name=Aman+Kumar&background=10b981&color=fff",
    rating: 5,
    review:
      "The platform is simple, fast, and reliable. I've joined tournaments, made new friends, and never miss weekend matches.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            Testimonials
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Loved By Players Across India
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Thousands of players use SportsMate to
            discover communities, find partners,
            and enjoy their favorite sports.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {testimonials.map((user) => (
            <div
              key={user.id}
              className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Top Gradient */}
              <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600"></div>

              <div className="p-8">

                {/* Quote Icon */}
                <div className="flex justify-between items-center mb-6">
                  <Quote
                    size={40}
                    className="text-blue-100"
                  />

                  <div className="flex gap-1">
                    {[...Array(user.rating)].map(
                      (_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Review */}
                <p className="text-gray-600 leading-relaxed mb-8">
                  "{user.review}"
                </p>

                {/* User */}
                <div className="flex items-center gap-4">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-14 h-14 rounded-full border-2 border-blue-100"
                  />

                  <div>
                    <h4 className="font-bold text-gray-900">
                      {user.name}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">

          <div className="bg-white rounded-3xl p-6 text-center shadow-md">
            <h3 className="text-4xl font-bold text-blue-600">
              5K+
            </h3>
            <p className="text-gray-600 mt-2">
              Happy Players
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-md">
            <h3 className="text-4xl font-bold text-green-600">
              4.9★
            </h3>
            <p className="text-gray-600 mt-2">
              Average Rating
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-md">
            <h3 className="text-4xl font-bold text-purple-600">
              100+
            </h3>
            <p className="text-gray-600 mt-2">
              Communities
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-md">
            <h3 className="text-4xl font-bold text-orange-600">
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

export default Testimonials;

