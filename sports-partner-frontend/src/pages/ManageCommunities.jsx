import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCommunity,
  fetchCommunities,
  toggleCommunityActive,
  toggleCommunityBlock,
} from "../redux/slices/communitySlice";

const ManageCommunities = () => {
  const dispatch = useDispatch();
  const { communities, loading, actionLoading, error } = useSelector(
    (state) => state.communities,
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  const filteredCommunities = communities.filter((community) => {
    const searchText = `${community.name} ${community.city || ""} ${
      community.state || ""
    } ${community.game?.name || ""}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this community?",
    );

    if (confirmDelete) {
      dispatch(deleteCommunity(id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">Manage Communities</h1>
            <p className="mt-2 text-slate-400">
              Review, block, activate, and delete communities.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
              <p className="text-sm text-slate-400">Total</p>
              <p className="text-2xl font-bold">{communities.length}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
              <p className="text-sm text-slate-400">Active</p>
              <p className="text-2xl font-bold text-emerald-400">
                {communities.filter((item) => item.isActive).length}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
              <p className="text-sm text-slate-400">Blocked</p>
              <p className="text-2xl font-bold text-red-400">
                {communities.filter((item) => item.isBlock).length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <input
            type="text"
            placeholder="Search by name, game, city, or state"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Loading communities...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCommunities.map((community) => (
              <div
                key={community._id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-violet-500 font-bold">
                    {community.image ? (
                      <img
                        src={community.image}
                        alt={community.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      community.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{community.name}</h3>
                    <p className="text-sm text-slate-400">
                      {community.game?.name || "No game"}
                    </p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                  {community.description || "No description added."}
                </p>

                <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-slate-500">Members</p>
                    <p className="font-semibold">
                      {community.members?.length || 0}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-slate-500">Privacy</p>
                    <p className="font-semibold capitalize">
                      {community.privacy}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      community.isActive
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {community.isActive ? "Active" : "Inactive"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      community.isBlock
                        ? "bg-red-500/10 text-red-300"
                        : "bg-blue-500/10 text-blue-300"
                    }`}
                  >
                    {community.isBlock ? "Blocked" : "Allowed"}
                  </span>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    {community.city || "Unknown city"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      dispatch(toggleCommunityActive(community._id))
                    }
                    className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
                  >
                    {community.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      dispatch(toggleCommunityBlock(community._id))
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                      community.isBlock
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {community.isBlock ? "Unblock" : "Block"}
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleDelete(community._id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filteredCommunities.length === 0 && (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No communities found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCommunities;
