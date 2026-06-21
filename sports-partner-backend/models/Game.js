import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required: true,
    },

    icon: String,
  },
  {
    timestamps: true,
  },
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
  