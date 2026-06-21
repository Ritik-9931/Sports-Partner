import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    speed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

locationSchema.index({
  location: "2dsphere",
});

const Location = mongoose.model("Location", locationSchema);

export default Location;