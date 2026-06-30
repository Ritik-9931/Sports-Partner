import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGames,
  createGame,
  updateGame,
  deleteGame,
} from "../redux/slices/gameSlice";
import { fetchProfile } from "../redux/slices/userSlice";

const Games = () => {
  const dispatch = useDispatch();

  const { games, loading, error } = useSelector((state) => state.games);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { profile } = useSelector((state) => state.userInfo);

  const isAdmin = profile?.role === "admin";

  const [showForm, setShowForm] = useState(false);

  const [editingGame, setEditingGame] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Indoor",
    icon: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchGames());
  }, [dispatch]);

  const userId = profile?._id;

  const canManageGame = (game) =>
    profile?.role === "admin" ||
    String(game.creator?._id || game.creator) === String(userId);

  const filteredGames = games.filter((game) => {
    const matchSearch = game.name?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category === "All" || game.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Games</h1>
            <p className="mt-2 text-slate-400">
              Explore indoor and outdoor games available on the platform.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
            <p className="text-sm text-slate-400">Total Games</p>
            <p className="text-2xl font-bold">{games.length}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingGame(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-violet-600 px-5 py-2 text-white"
        >
          + Add Game
        </button>

        <div className="my-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500 md:w-48"
            >
              <option value="All">All Games</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Loading games...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGames.map((game) => (
              <div
                key={game._id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-violet-500/10 text-2xl font-bold text-violet-300">
                  {game.icon ? (
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    game.name?.charAt(0)?.toUpperCase()
                  )}
                </div>

                <h3 className="text-xl font-semibold">{game.name}</h3>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      game.category === "Indoor"
                        ? "bg-blue-500/10 text-blue-300"
                        : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {game.category}
                  </span>

                  <span className="text-xs text-slate-500">
                    {game.createdAt
                      ? new Date(game.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Added by {game.creator?.name || "Unknown"}
                </p>

                {canManageGame && (
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGame(game);

                        setFormData({
                          name: game.name,
                          category: game.category,
                          icon: game.icon,
                        });

                        setShowForm(true);
                      }}
                      className="rounded bg-blue-600 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        if (!window.confirm("Delete game?")) return;

                        await dispatch(deleteGame(game._id)).unwrap();
                      }}
                      className="rounded bg-red-600 px-3 py-2 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredGames.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No games found.
              </div>
            )}
          </div>
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold">
              {editingGame ? "Update Game" : "Create Game"}
            </h2>

            <input
              type="text"
              placeholder="Game Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="mb-4 w-full rounded bg-slate-800 p-3"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="mb-4 w-full rounded bg-slate-800 p-3"
            >
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>

            <input
              type="text"
              placeholder="Icon URL"
              value={formData.icon}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icon: e.target.value,
                })
              }
              className="mb-6 w-full rounded bg-slate-800 p-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded bg-gray-700 px-5 py-2"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    if (editingGame) {
                      await dispatch(
                        updateGame({
                          id: editingGame._id,
                          formData,
                        }),
                      ).unwrap();

                      alert("Game updated");
                    } else {
                      await dispatch(createGame(formData)).unwrap();

                      alert("Game created");
                    }

                    setShowForm(false);
                  } catch (err) {
                    alert(err);
                  }
                }}
                className="rounded bg-violet-600 px-5 py-2"
              >
                {editingGame ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
