import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommunity } from "../redux/slices/communitySlice";
import { fetchGames } from "../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";

const AddCommunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading, error } = useSelector((state) => state.communities);
  const { games } = useSelector((state) => state.games);

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
    dispatch(fetchGames());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      dispatch(createCommunity(formData)).unwrap();

      alert("Community Created Successfully");

      setForm({
        name: "",
        description: "",
        game: "",
        privacy: "public",
        city: "",
        state: "",
        image: null,
      });

      navigate(-1);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">Add Community</h1>
        <p className="mt-2 text-slate-400">Create a new sports community.</p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Community name"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
          />

          <select
            name="game"
            value={form.game}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
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
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
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
            disabled={actionLoading}
            className="w-full rounded-lg bg-violet-500 px-5 py-3 font-semibold hover:bg-violet-600 disabled:opacity-60"
          >
            {actionLoading ? "Creating..." : "Create Community"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCommunity;
