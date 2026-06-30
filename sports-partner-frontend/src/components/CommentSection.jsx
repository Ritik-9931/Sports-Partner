import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  fetchComments,
} from "../redux/slices/communityPostSlice";

const CommentSection = ({ postId, currentUser, isCreator, isAdmin }) => {
  const dispatch = useDispatch();

  const { comments } = useSelector((state) => state.communityPosts);

  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const postComments = comments[postId] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await dispatch(
        addComment({
          postId,
          comment: text,
        }),
      ).unwrap();

      setText("");
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await dispatch(
        deleteComment({
          postId,
          commentId,
        }),
      ).unwrap();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="mt-5 border-t border-slate-700 pt-5">
      <h3 className="mb-4 text-lg font-semibold">
        Comments ({postComments.length})
      </h3>

      {/* Add Comment */}

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
        />

        <button className="rounded-lg bg-violet-600 px-5 text-white hover:bg-violet-700">
          Send
        </button>
      </form>

      {/* Comments */}

      {postComments.length === 0 ? (
        <p className="text-slate-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {postComments.map((comment) => {
            const canDelete =
              String(comment.author?._id) === String(currentUser) ||
              isCreator ||
              isAdmin;

            return (
              <div key={comment._id} className="rounded-lg bg-slate-950 p-4">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-violet-600">
                      {comment.author?.profileImage ? (
                        <img
                          src={comment.author.profileImage}
                          alt={comment.author.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-bold">
                          {comment.author?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold">{comment.author?.name}</h4>

                      <p className="mt-1 text-slate-300">{comment.comment}</p>

                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-sm text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
