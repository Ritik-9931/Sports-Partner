import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveCommunityJoinRequest,
  blockUserFromCommunity,
  fetchCommunityById,
  fetchCommunityJoinRequests,
  joinCommunity,
  leaveCommunity,
  rejectCommunityJoinRequest,
  unblockUserFromCommunity,
} from "../redux/slices/communitySlice";
import { fetchProfile } from "../redux/slices/userSlice";

const CommunityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedCommunity: community,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.communities);

  const { profile } = useSelector((state) => state.userInfo);
  const { joinRequests } = useSelector((state) => state.communities);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchCommunityById(id));
  }, [dispatch, id]);

  const userId = profile?._id || profile?.id;

  const isAdmin = profile?.role === "admin";

  const isCreator = community
    ? String(community.creator?._id || community.creator) === String(userId)
    : false;

  const isMember = community?.members?.some((member) => {
    const memberId = member._id || member;
    return String(memberId) === String(userId);
  });

  const canManage = isCreator || isAdmin;

  useEffect(() => {
    if (community && (isCreator || isAdmin)) {
      dispatch(fetchCommunityJoinRequests(community._id));
    }
  }, [dispatch, community?._id, isCreator, isAdmin]);

  const handleJoinLeave = async () => {
    if (!community) return;

    if (isMember) {
      try {
        await dispatch(leaveCommunity(community._id)).unwrap();

        alert("Leave Community");
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        await dispatch(joinCommunity(community._id)).unwrap();

        alert("Join Community");
      } catch (error) {
        alert(error);
      }
    }

    dispatch(fetchCommunityById(community._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
          Loading community details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-2xl font-bold text-red-300">Access Denied</h1>
          <p className="mt-2 text-red-200">{error}</p>

          <button
            onClick={() => navigate("/communities")}
            className="mt-6 rounded-lg bg-slate-100 px-5 py-2.5 font-semibold text-slate-950 hover:bg-white"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  if (!community) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/communities")}
          className="mb-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900"
        >
          Back
        </button>

        {(isCreator || isAdmin) && community.privacy === "private" && (
          <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold">Join Requests</h2>

            {joinRequests.length === 0 ? (
              <p className="text-slate-400">No pending requests.</p>
            ) : (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between rounded-lg bg-slate-950 p-4"
                  >
                    <div>
                      <p className="font-semibold">{request.user?.name}</p>
                      <p className="text-sm text-slate-400">
                        {request.user?.email}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          dispatch(approveCommunityJoinRequest(request._id))
                        }
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          dispatch(rejectCommunityJoinRequest(request._id))
                        }
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-8 mt-8 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
          <div className="h-56 bg-slate-800">
            {community.image ? (
              <img
                src={community.image}
                alt={community.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl font-bold text-slate-500">
                {community.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <h1 className="text-4xl font-bold">{community.name}</h1>

                <p className="mt-2 max-w-3xl text-slate-400">
                  {community.description || "No description added."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                    {community.game?.name || "No game"}
                  </span>

                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 capitalize">
                    {community.privacy}
                  </span>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                    {community.city || "Unknown city"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      community.isActive
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {community.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {canManage ? (
                  <button
                    onClick={() =>
                      navigate(`/communities/edit/${community._id}`)
                    }
                    className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    disabled={actionLoading}
                    onClick={handleJoinLeave}
                    className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                      isMember
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-violet-500 hover:bg-violet-600"
                    }`}
                  >
                    {isMember ? "Leave Community" : "Join Community"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Members</h2>
            <span className="rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-300">
              {community.members?.length || 0} members
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {community.members?.map((member) => (
              <div
                key={member._id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-violet-500 font-bold">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      member.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-slate-400">
                      {member.city || "Location not added"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                    {member.skillLevel || "Beginner"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      member.isOnline
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {member.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                {(isCreator || isAdmin) &&
                  String(member._id) !== String(userId) && (
                    <button
                      onClick={() =>
                        dispatch(
                          blockUserFromCommunity({
                            communityId: community._id,
                            userId: member._id,
                          }),
                        )
                      }
                      className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                      Block User
                    </button>
                  )}
              </div>
            ))}

            {community.members?.length === 0 && (
              <p className="text-slate-400">No members yet.</p>
            )}
          </div>
        </div>
      </div>
      {(isCreator || isAdmin) && (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-bold">Blocked Users</h2>

          {community.blockedUsers?.length === 0 ? (
            <p className="text-slate-400">No blocked users.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {community.blockedUsers?.map((user) => (
                <div
                  key={user._id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>

                  <button
                    onClick={() =>
                      dispatch(
                        unblockUserFromCommunity({
                          communityId: community._id,
                          userId: user._id,
                        }),
                      )
                    }
                    className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    Unblock User
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityDetail;
