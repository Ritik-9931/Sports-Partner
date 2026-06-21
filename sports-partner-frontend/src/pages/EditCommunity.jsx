import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunities,
  toggleCommunityActive,
  updateCommunity,
} from "../redux/slices/communitySlice";
import { fetchGames } from "../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/slices/userSlice";

const EditCommunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { communities, actionLoading, error } = useSelector(
    (state) => state.communities,
  );
  const { games } = useSelector((state) => state.games);
  const { profile } = useSelector((state) => state.userInfo);

  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    game: "",
    privacy: "public",
    city: "",
    state: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchCommunities());
    dispatch(fetchGames());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);

    const community = myCommunities.find((item) => item._id === id);

    if (community) {
      setForm({
        name: community.name || "",
        description: community.description || "",
        game: community.game?._id || community.game || "",
        privacy: community.privacy || "public",
        city: community.city || "",
        state: community.state || "",
        image: null,
      });
    }
  };

  const myCommunities =
    profile?.role === "admin"
      ? communities
      : communities.filter((community) => {
          const creatorId = community.creator?._id || community.creator;
          const userId = profile?._id || profile?.id;

          return String(creatorId) === String(userId);
        });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      await dispatch(updateCommunity({ id: selectedId, formData })).unwrap();

      alert("Community Update Successfully");

      navigate(-1);
    } catch (error) {
      alert(error);
    }
  };

  const selectedCommunity = communities.find((item) => item._id === selectedId);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">Edit Community</h1>
        <p className="mt-2 text-slate-400">
          Update your community details or deactivate it.
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <select
            value={selectedId}
            onChange={handleSelect}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select community</option>
            {myCommunities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Community name"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="game"
            value={form.game}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select game</option>
            {games.map((game) => (
              <option key={game._id} value={game._id}>
                {game.name}
              </option>
            ))}
          </select>

          <select
            name="privacy"
            value={form.privacy}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300"
          />

          <button
            disabled={actionLoading || !selectedId}
            className="w-full rounded-lg bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600 disabled:opacity-60"
          >
            {actionLoading ? "Updating..." : "Update Community"}
          </button>
        </form>

        {selectedCommunity && (
          <button
            onClick={() =>
              dispatch(toggleCommunityActive(selectedCommunity._id))
            }
            disabled={actionLoading}
            className="mt-4 w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold hover:bg-amber-600 disabled:opacity-60"
          >
            {selectedCommunity.isActive
              ? "Deactivate Community"
              : "Activate Community"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditCommunity;
