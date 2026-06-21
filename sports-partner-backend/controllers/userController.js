import User from "../models/User.js";
import Game from "../models/Game.js";
import Community from "../models/Community.js";

export const updatePrivacy = async (req, res) => {
  try {
    const { locationPrivacy, liveTrackingEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        locationPrivacy,
        liveTrackingEnabled,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)],
        },
        lastSeen: new Date(),
        address: address,
      },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("preferredGames")
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic Info
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.age !== undefined) user.age = req.body.age;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.state !== undefined) user.state = req.body.state;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    // Sports Info
    if (req.body.skillLevel !== undefined)
      user.skillLevel = req.body.skillLevel;

    if (req.body.preferredGames !== undefined) {
      user.preferredGames =
        typeof req.body.preferredGames === "string"
          ? JSON.parse(req.body.preferredGames)
          : req.body.preferredGames;
    }

    if (req.body.availability !== undefined) {
      user.availability =
        typeof req.body.availability === "string"
          ? JSON.parse(req.body.availability)
          : req.body.availability;
    }

    // Privacy Settings
    if (req.body.locationPrivacy !== undefined)
      user.locationPrivacy = req.body.locationPrivacy;

    if (req.body.liveTrackingEnabled !== undefined)
      user.liveTrackingEnabled =
        req.body.liveTrackingEnabled === true ||
        req.body.liveTrackingEnabled === "true";

    // Location Update
    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      user.location = {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
      };
    }

    // Profile Image
    if (req.file) {
      user.profileImage = req.file.path;
    }

    user.lastSeen = new Date();

    const updatedUser = await user.save();

    const populatedUser = await User.findById(updatedUser._id)
      .populate("preferredGames")
      .select("-password");

    res.status(200).json({
      success: true,
      user: populatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNearbyPartners = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [longitude, latitude] = currentUser.location.coordinates;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Please update your location first",
      });
    }

    const partners = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: 3000,
          spherical: true,
          query: {
            _id: { $ne: currentUser._id },
            role: "user",
            isBlocked: false,
            locationPrivacy: { $ne: "hidden" },
          },
        },
      },
      {
        $project: {
          password: 0,
          location: 0,
          address: 0,
          liveTrackingEnabled: 0,
          lastSeen: 0,
        },
      },
    ]);

    await User.populate(partners, {
      path: "preferredGames",
      select: "name category icon",
    });

    res.status(200).json({
      success: true,
      partners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -location -address -liveTrackingEnabled")
      .populate("preferredGames", "name category icon");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStatsHome = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalGames = await Game.countDocuments();

    const totalCommunities = await Community.countDocuments();

    res.status(200).json({
      totalUsers,
      totalGames,
      totalCommunities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
