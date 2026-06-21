import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGames } from "../redux/slices/gameSlice";

const Games = () => {
  const dispatch = useDispatch();

  const { games, loading, error } = useSelector((state) => state.games);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

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

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
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
    </div>
  );
};

export default Games;
