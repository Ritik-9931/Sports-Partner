import mongoose from "mongoose";

const communitySchmea = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    city: String,

    state: String,

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Community = mongoose.model("Community", communitySchmea);

export default Community;
