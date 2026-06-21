import { useEffect, useState } from "react";
import {
  Users,
  ArrowRight,
  Trophy,
  Lock,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";

const Communities = () => {
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await api.get("/communities");

        const activeCommunities =
          data.communities
            ?.filter((c) => c.isActive && !c.isBlock)
            .slice(0, 4) || [];

        setCommunities(activeCommunities);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            Sports Communities
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Join Active Communities
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Meet like-minded players, organize games, participate in events,
            and grow your network.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">
            Loading communities...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communities.map((community) => (
              <div
                key={community._id}
                className="relative group backdrop-blur-lg bg-white border border-gray-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Privacy Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
                      community.privacy === "private"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {community.privacy === "private" ? (
                      <Lock size={12} />
                    ) : (
                      <Globe size={12} />
                    )}
                    {community.privacy}
                  </span>
                </div>

                {/* Community Image */}
                <div className="mb-4">
                  {community.image ? (
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                      {community.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Game */}
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {community.game?.name || "Sports"}
                </span>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  {community.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                  {community.description || "No description available."}
                </p>

                {/* Members */}
                <div className="flex items-center gap-2 mt-5 text-gray-500">
                  <Users size={18} />
                  <span>
                    {community.members?.length || 0} Members
                  </span>
                </div>

                {/* City */}
                <div className="mt-2 text-sm text-gray-500">
                  📍 {community.city || "Unknown City"}
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate(`/community/${community._id}`)
                  }
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:gap-4 transition-all"
                >
                  View Community
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/communities")}
            className="px-8 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all"
          >
            Explore All Communities
          </button>
        </div>
      </div>
    </section>
  );
};

export default Communities;