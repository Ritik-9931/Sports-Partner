import { useEffect, useState } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPlayRequestMessage,
  createPlayRequest,
  fetchMyPlayRequests,
} from "../redux/slices/playRequestSlice";
import { fetchProfile } from "../redux/slices/userSlice";

const Partners = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [skillLevel, setSkillLevel] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [inviteData, setInviteData] = useState({
    game: "",
    message: "",
    scheduleDate: "",
    meetingName: "",
    meetingAddress: "",
  });

  const { user } = useSelector((state) => state.auth);

  const {
    actionLoading: inviteLoading,
    error: inviteError,
    success: inviteSuccess,
    playRequests,
  } = useSelector((state) => state.playRequests);

  useEffect(() => {
    dispatch(fetchMyPlayRequests());
  }, [dispatch]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/users/partners");
      setPartners(data.partners || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch nearby partners",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const { data } = await api.get("/games");
      setGames(data.games || []);
    } catch {
      setGames([]);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchGames();
  }, []);

  const openInviteModal = (partner) => {
    dispatch(clearPlayRequestMessage());
    setSelectedPartner(partner);
    setError("");

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

  const filteredPartners = partners.filter((partner) => {
    const searchText = `${partner.name} ${partner.city || ""} ${
      partner.state || ""
    } ${partner.skillLevel || ""}`.toLowerCase();

    const matchSearch = searchText.includes(search.toLowerCase());
    const matchSkill =
      skillLevel === "All" || partner.skillLevel === skillLevel;

    return matchSearch && matchSkill;
  });

  const pendingRequestsCount = playRequests.filter(
    (request) => request.status === "pending" && request.receiver._id === user._id
  ).length || 0;
    
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Nearby Partners
            </h1>
            <p className="mt-2 text-slate-400">
              Find players around you within 2-3 km.
            </p>
          </div>

          <button
            onClick={() => navigate("/play-requests")}
            className="relative rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-amber-500/30"
          >
            Requests
            {pendingRequestsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
            <p className="text-sm text-slate-400">Found Nearby</p>
            <p className="text-2xl font-bold">{filteredPartners.length}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <input
              type="text"
              placeholder="Search by name, city, state, or skill"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500 md:w-52"
            >
              <option value="All">All Skills</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {(error || inviteError) && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error || inviteError}
          </div>
        )}

        {inviteSuccess && (
          <div className="mb-6 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Play request sent successfully.
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Finding nearby partners...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPartners.map((partner) => (
              <div
                key={partner._id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-violet-500 font-bold text-white">
                    {partner.profileImage ? (
                      <img
                        src={partner.profileImage}
                        alt={partner.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      partner.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{partner.name}</h3>
                    <p className="text-sm text-slate-400">
                      {partner.city || "Unknown city"}
                      {partner.state ? `, ${partner.state}` : ""}
                    </p>
                  </div>
                </div>

                <p className="mb-5 line-clamp-2 text-sm text-slate-400">
                  {partner.bio || "No bio added yet."}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                    {partner.skillLevel || "Beginner"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      partner.isOnline
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {partner.isOnline ? "Online" : "Offline"}
                  </span>

                  {partner.distance !== undefined && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      {(partner.distance / 1000).toFixed(1)} km away
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-sm font-medium text-slate-300">
                    Preferred Games
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {partner.preferredGames?.length > 0 ? (
                      partner.preferredGames.map((game) => (
                        <span
                          key={game._id || game}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                        >
                          {game.name || "Game"}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        No games selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/viewProfile/${partner._id}`)}
                    className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => openInviteModal(partner)}
                    className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Invite
                  </button>
                </div>
              </div>
            ))}

            {filteredPartners.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No nearby partners found. Update your location or try again
                later.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
              >
                <option value="">Choose game</option>
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
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
              />

              <input
                name="meetingName"
                value={inviteData.meetingName}
                onChange={handleInviteChange}
                placeholder="Meeting place name"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />

              <textarea
                name="meetingAddress"
                value={inviteData.meetingAddress}
                onChange={handleInviteChange}
                placeholder="Meeting address"
                rows="2"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />

              <textarea
                name="message"
                value={inviteData.message}
                onChange={handleInviteChange}
                placeholder="Message"
                rows="3"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeInviteModal}
                  className="rounded-lg bg-slate-700 px-4 py-3 font-semibold text-white hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="rounded-lg bg-violet-500 px-4 py-3 font-semibold text-white hover:bg-violet-600 disabled:opacity-60"
                >
                  {inviteLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
