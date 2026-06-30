import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteCommunityPost,
  likeCommunityPost,
} from "../redux/slices/communityPostSlice";
import CommentSection from "./CommentSection";

const CommunityPostCard = ({ post, profile, isCreator, isAdmin }) => {
  const dispatch = useDispatch();

  const [showComments, setShowComments] = useState(false);

  const currentUser = profile?._id || profile?.id;

  const canDelete =
    String(post.author?._id) === String(currentUser) || isCreator || isAdmin;

  const isLiked = post.likes?.some((id) => String(id) === String(currentUser));

  const handleLike = async () => {
    try {
      await dispatch(likeCommunityPost(post._id)).unwrap();
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await dispatch(deleteCommunityPost(post._id)).unwrap();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-violet-600">
            {post.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-bold text-white">
                {post.author?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{post.author?.name}</h3>

            <p className="text-sm text-slate-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>

      {/* Message */}
      <div className="mt-5 whitespace-pre-wrap text-slate-200">
        {post.message}
      </div>

      {/* Image */}
      {post.image && (
        <div className="mt-5 overflow-hidden rounded-lg">
          <img
            src={post.image}
            alt="Post"
            className="max-h-[500px] w-full rounded-lg object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center gap-4 border-t border-slate-700 pt-4">
        <button
          onClick={handleLike}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            isLiked
              ? "bg-pink-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          ❤️ {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
        >
          💬 {showComments ? "Hide" : "Comments"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          currentUser={currentUser}
          isCreator={isCreator}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default CommunityPostCard;
