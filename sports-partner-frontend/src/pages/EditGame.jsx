import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames, updateGame } from "../redux/slices/gameSlice";
import { useNavigate } from "react-router-dom";

const EditGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { games, loading, error } = useSelector((state) => state.games);

  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    icon: "",
  });

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handleSelectGame = (e) => {
    const id = e.target.value;
    setSelectedId(id);

    const selectedGame = games.find((game) => game._id === id);

    if (selectedGame) {
      setFormData({
        name: selectedGame.name || "",
        category: selectedGame.category || "",
        icon: selectedGame.icon || "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) return;

    try {
      await dispatch(
        updateGame({
          id: selectedId,
          formData,
        }),
      ).unwrap();

      alert("Game update successfully");

      navigate(-1);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Edit Game</h1>
        <p className="mt-2 text-slate-400">Update existing game details.</p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Game
            </label>
            <select
              value={selectedId}
              onChange={handleSelectGame}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value="">Choose game</option>
              {games.map((game) => (
                <option key={game._id} value={game._id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Game Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value="">Select category</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Icon URL
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedId}
            className="w-full rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Game"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditGame;
