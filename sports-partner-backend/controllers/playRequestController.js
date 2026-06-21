import PlayRequest from "../models/PlayRequest.js";
import User from "../models/User.js";
import Game from "../models/Game.js";

export const createPlayRequest = async (req, res) => {
  try {
    const { receiver, game, message, scheduleDate, meetingLocation } = req.body;

    if (String(receiver) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot invite yourself",
      });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser || receiverUser.isBlocked) {
      return res.status(404).json({
        success: false,
        message: "Player not available",
      });
    }

    const selectedGame = await Game.findById(game);

    if (!selectedGame) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    const alreadyPending = await PlayRequest.findOne({
      sender: req.user._id,
      receiver,
      game,
      status: "pending",
    });

    if (alreadyPending) {
      return res.status(400).json({
        success: false,
        message: "You already sent a pending request for this game",
      });
    }

    const playRequest = await PlayRequest.create({
      sender: req.user._id,
      receiver,
      game,
      message,
      scheduleDate,
      meetingLocation,
    });

    const populatedRequest = await PlayRequest.findById(playRequest._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .populate("game", "name category icon");

    res.status(201).json({
      success: true,
      message: "Play request sent successfully",
      playRequest: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyPlayRequests = async (req, res) => {
  try {
    const playRequests = await PlayRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .populate("game", "name category icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      playRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePlayRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const playRequest = await PlayRequest.findById(req.params.id);

    if (!playRequest) {
      return res.status(404).json({
        success: false,
        message: "Play request not found",
      });
    }

    const isSender = String(playRequest.sender) === String(req.user._id);
    const isReceiver = String(playRequest.receiver) === String(req.user._id);

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (status === "cancelled" && !isSender) {
      return res.status(403).json({
        success: false,
        message: "Only sender can cancel request",
      });
    }

    if (["accepted", "rejected"].includes(status) && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: "Only receiver can accept or reject request",
      });
    }

    playRequest.status = status;
    await playRequest.save();

    const updatedRequest = await PlayRequest.findById(playRequest._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .populate("game", "name category icon");

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      playRequest: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
