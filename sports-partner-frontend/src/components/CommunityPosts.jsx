import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCommunityPosts } from "../redux/slices/communityPostSlice";

import CreatePost from "./CreatePost";
import CommunityPostCard from "./CommunityPostCard";

const CommunityPosts = ({
  community,
  profile,
  isCreator,
  isAdmin,
  isMember,
}) => {
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector(
    (state) => state.communityPosts,
  );

  useEffect(() => {
    if (community?._id) {
      dispatch(fetchCommunityPosts(community._id));
    }
  }, [dispatch, community?._id]);

  if (!community) return null;

  return (
    <div className="mt-8">
      {/* Create Post */}

      <CreatePost communityId={community._id} canPost={isCreator || isAdmin} />

      {/* Feed */}

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Community Feed</h2>

          <span className="rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-400">
            {posts.length} Posts
          </span>
        </div>

        {loading && (
          <div className="py-10 text-center text-slate-400">
            Loading posts...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-700 py-16 text-center">
            <div className="text-5xl">📝</div>

            <h3 className="mt-4 text-xl font-semibold">No announcements yet</h3>

            <p className="mt-2 text-slate-400">
              {isCreator || isAdmin
                ? "Create the first announcement for your community."
                : "There are no announcements yet."}
            </p>
          </div>
        )}

        {!loading &&
          posts.map((post) => (
            <CommunityPostCard
              key={post._id}
              post={post}
              profile={profile}
              isCreator={isCreator}
              isAdmin={isAdmin}
              isMember={isMember}
            />
          ))}
      </div>
    </div>
  );
};

export default CommunityPosts;
