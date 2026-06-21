import { useEffect, useState } from "react";
import { MapPin, Trophy, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../../service/api";

import {
  clearPlayRequestMessage,
  createPlayRequest,
} from "../../redux/slices/playRequestSlice";

const NearbyPlayers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPartner, setSelectedPartner] = useState(null);

  const [inviteData, setInviteData] = useState({
    game: "",
    message: "",
    scheduleDate: "",
    meetingName: "",
    meetingAddress: "",
  });

  const {
    actionLoading: inviteLoading,
    error: inviteError,
    success: inviteSuccess,
  } = useSelector((state) => state.playRequests);

  const fetchNearbyPlayers = async () => {
    try {
      const { data } = await api.get("/users/partners");

      setPlayers((data.partners || []).slice(0, 4));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const { data } = await api.get("/games");

      setGames(data.games || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNearbyPlayers();
    fetchGames();
  }, []);

  const openInviteModal = (partner) => {
    dispatch(clearPlayRequestMessage());

    setSelectedPartner(partner);

    setInviteData({
      game: "",
      message: "",
      scheduleDate: "",
      meetingName: "",
      meetingAddress: "",
    });
  };

  const closeInviteModal = () => {
    setSelectedPartner(null);
  };

  const handleInviteChange = (e) => {
    setInviteData({
      ...inviteData,
      [e.target.name]: e.target.value,
    });
  };

  const sendInvite = async (e) => {
    e.preventDefault();

    if (!selectedPartner) return;

    const result = await dispatch(
      createPlayRequest({
        receiver: selectedPartner._id,
        game: inviteData.game,
        message: inviteData.message,
        scheduleDate: inviteData.scheduleDate,
        meetingLocation: {
          name: inviteData.meetingName,
          address: inviteData.meetingAddress,
          coordinates: [0, 0],
        },
      }),
    );

    if (createPlayRequest.fulfilled.match(result)) {
      closeInviteModal();
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
            Nearby Players
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Find Players Around You
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Connect with active players in your area and start playing today.
          </p>
        </div>

        {inviteSuccess && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            Play request sent successfully.
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">
            Loading nearby players...
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {players.map((player) => (
              <div
                key={player._id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        player.profileImage ||
                        `https://ui-avatars.com/api/?name=${player.name}`
                      }
                      alt={player.name}
                      className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
                    />

                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {player.name}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Trophy size={18} className="text-blue-600" />
                      <span>
                        {player.preferredGames?.[0]?.name || "Sports Player"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} className="text-red-500" />

                      <span>
                        {player.distance
                          ? `${(player.distance / 1000).toFixed(1)} km away`
                          : player.city || "Nearby"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {player.skillLevel || "Beginner"}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/viewProfile/${player._id}`)}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-semibold text-white transition hover:scale-105"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => openInviteModal(player)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      <Send size={16} />
                      Invite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/partners")}
            className="rounded-xl border border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View All Players
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl text-white">
            <h2 className="text-2xl font-bold">
              Invite {selectedPartner.name}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Choose a game and send a play request.
            </p>

            {inviteError && (
              <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {inviteError}
              </div>
            )}

            <form onSubmit={sendInvite} className="mt-6 space-y-4">
              <select
                name="game"
                value={inviteData.game}
                onChange={handleInviteChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="">Choose Game</option>

                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.name} - {game.category}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                name="scheduleDate"
                value={inviteData.scheduleDate}
                onChange={handleInviteChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <input
                name="meetingName"
                value={inviteData.meetingName}
                onChange={handleInviteChange}
                placeholder="Meeting Place Name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <textarea
                name="meetingAddress"
                value={inviteData.meetingAddress}
                onChange={handleInviteChange}
                placeholder="Meeting Address"
                rows="2"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <textarea
                name="message"
                value={inviteData.message}
                onChange={handleInviteChange}
                placeholder="Message"
                rows="3"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeInviteModal}
                  className="rounded-lg bg-slate-700 px-4 py-3 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="rounded-lg bg-violet-500 px-4 py-3 font-semibold disabled:opacity-60"
                >
                  {inviteLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default NearbyPlayers;
