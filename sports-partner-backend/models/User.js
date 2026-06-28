import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const availabilitySchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    age: Number,

    city: String,

    state: String,

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    preferredGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],

    availability: [availabilitySchema],

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // GeoJSON location for MongoDB geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    // Privacy Settings
    locationPrivacy: {
      type: String,
      enum: ["hidden", "distance_only", "live_location"],
      default: "hidden",
    },

    liveTrackingEnabled: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    
    otp: String,

    otpExpire: Date,
  },
  {
    timestamps: true,
  },
);

// MongoDB Geo Index
userSchema.index({
  location: "2dsphere",
});

// Compare Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
