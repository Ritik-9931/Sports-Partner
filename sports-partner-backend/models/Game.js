import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required: true,
    },

    icon: String,

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Game", gameSchema);
