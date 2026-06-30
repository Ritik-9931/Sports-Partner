import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommunityPost } from "../redux/slices/communityPostSlice";

const CreatePost = ({ communityId, canPost }) => {
  const dispatch = useDispatch();

  const { actionLoading } = useSelector(
    (state) => state.communityPosts,
  );

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  if (!canPost) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !image) {
      return alert("Please write something.");
    }

    try {
      const formData = new FormData();

      formData.append("message", message);

      if (image) {
        formData.append("image", image);
      }

      await dispatch(
        createCommunityPost({
          communityId,
          formData,
        }),
      ).unwrap();

      setMessage("");
      setImage(null);
      setPreview("");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-5 text-2xl font-bold">
        Create Announcement
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something for your community..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-violet-500"
        />

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="preview"
              className="max-h-72 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <label className="cursor-pointer rounded-lg bg-slate-800 px-5 py-2 font-medium hover:bg-slate-700">
            📷 Upload Image

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </label>

          <button
            type="submit"
            disabled={actionLoading}
            className="rounded-lg bg-violet-600 px-6 py-2.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {actionLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;