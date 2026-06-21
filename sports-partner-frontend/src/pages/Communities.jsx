import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCommunity,
  fetchCommunities,
  joinCommunity,
  leaveCommunity,
} from "../redux/slices/communitySlice";
import { fetchProfile } from "../redux/slices/userSlice";

const Communities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { communities, loading, actionLoading, error } = useSelector(
    (state) => state.communities,
  );

  const { profile } = useSelector((state) => state.userInfo);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCommunities());
    dispatch(fetchProfile());
  }, [dispatch]);

  const getUserId = () => profile?._id || profile?.id;

  const isAdmin = profile?.role === "admin";

  const isCreator = (community) => {
    const creatorId = community.creator?._id || community.creator;
    return String(creatorId) === String(getUserId());
  };

  const isMember = (community) =>
    community.members?.some((member) => {
      const memberId = member._id || member;
      return String(memberId) === String(getUserId());
    });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this community?",
    );

    if (confirmDelete) {
      dispatch(deleteCommunity(id));
    }
  };

  const handleJoinLeave = async (community) => {
    const joined = isMember(community);

    try {
      if (joined) {
        const confirmLeave = window.confirm(
          `Are you sure you want to leave "${community.name}"?`,
        );

        if (!confirmLeave) return;

        await dispatch(leaveCommunity(community._id)).unwrap();

        alert("Left community successfully");
      } else {
        const confirmJoin = window.confirm(
          community.privacy === "private"
            ? `Send join request to "${community.name}"?`
            : `Join "${community.name}"?`,
        );

        if (!confirmJoin) return;

        await dispatch(joinCommunity(community._id)).unwrap();

        alert(
          community.privacy === "private"
            ? "Join request sent successfully"
            : "Joined community successfully",
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCommunities = communities
    .filter((community) => community.isActive && !community.isBlock)
    .filter((community) => {
      const searchText = `${community.name} ${community.game?.name || ""} ${
        community.city || ""
      } ${community.state || ""}`.toLowerCase();

      return searchText.includes(search.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">Communities</h1>
            <p className="mt-2 text-slate-400">
              Discover and manage sports communities near you.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-community")}
            className="rounded-lg bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-600"
          >
            Create Community
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-violet-500"
            />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-sm text-slate-400">Available</p>
            <p className="text-2xl font-bold">{filteredCommunities.length}</p>
          </div>
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
            {filteredCommunities.map((community) => {
              const creator = isCreator(community);
              const joined = isMember(community);

              return (
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
                      <h3 className="text-lg font-semibold">
                        {community.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {community.game?.name || "No game"}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                    {community.description || "No description added."}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300 capitalize">
                      {community.privacy}
                    </span>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {community.members?.length || 0} Members
                    </span>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {community.city || "Unknown city"}
                    </span>

                    {creator && (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                        Creator
                      </span>
                    )}

                    {isAdmin && (
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                        Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/community/${community._id}`)}
                    className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-600"
                  >
                    View
                  </button>

                  {creator || isAdmin ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          navigate(`/edit-community/${community._id}`)
                        }
                        className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => handleDelete(community._id)}
                        className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleJoinLeave(community)}
                      className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                        joined
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-violet-500 hover:bg-violet-600"
                      }`}
                    >
                      {joined
                        ? "Leave Community"
                        : community.privacy === "private"
                          ? "Request to Join"
                          : "Join Community"}
                    </button>
                  )}
                </div>
              );
            })}

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

export default Communities;
