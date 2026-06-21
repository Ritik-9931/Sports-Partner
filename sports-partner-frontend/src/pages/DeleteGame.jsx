import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteGame, fetchGames } from "../redux/slices/gameSlice";

const DeleteGame = () => {
  const dispatch = useDispatch();
  const { games, loading, error } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (confirmDelete) {
      dispatch(deleteGame(id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Delete Games</h1>
          <p className="mt-2 text-slate-400">
            Remove games from your platform.
          </p>
        </div>

        {error && (
          <p className="mb-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {loading && (
          <p className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-slate-400">
            Loading games...
          </p>
        )}

        {!loading && games.length === 0 && (
          <p className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-slate-400">
            No games found.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div
              key={game._id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-red-500/10 text-xl font-bold text-red-400">
                {game.icon ? (
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  game.name?.charAt(0)
                )}
              </div>

              <h3 className="text-xl font-semibold">{game.name}</h3>

              <p className="mt-2 text-sm text-slate-400">
                Category: {game.category}
              </p>

              <button
                onClick={() => handleDelete(game._id)}
                className="mt-6 w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete Game
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeleteGame;