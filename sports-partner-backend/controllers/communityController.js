import Community from "../models/Community.js";
import CommunityJoinRequest from "../models/CommunityJoinRequest.js";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, game, privacy, city, state } = req.body;

    const community = await Community.create({
      name,
      description,
      game,
      privacy,
      city,
      state,
      image: req.file ? req.file.path : "",
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("game", "name category icon")
      .populate("creator", "name email profileImage")
      .populate("members", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("game", "name category icon")
      .populate("creator", "name email profileImage role")
      .populate("blockedUsers", "name email profileImage city state skillLevel")
      .populate(
        "members",
        "name email profileImage city state skillLevel isOnline",
      );

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isBlockedUser = community.blockedUsers.some(
      (user) => String(user._id || user) === String(req.user._id),
    );

    if (isBlockedUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are blocked from this community",
      });
    }
    
    const isAdmin = req.user.role === "admin";
    const isCreator = String(community.creator._id) === String(req.user._id);
    const isMember = community.members.some(
      (member) => String(member._id) === String(req.user._id),
    );

    if (
      community.privacy === "private" &&
      !isMember &&
      !isCreator &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "This is a private community. Only members can view details.",
      });
    }

    res.status(200).json({
      success: true,
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    if (
      String(community.creator) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const fields = ["name", "description", "game", "privacy", "city", "state"];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        community[field] = req.body[field];
      }
    });

    if (req.file) {
      community.image = req.file.path;
    }

    const updatedCommunity = await community.save();

    res.status(200).json({
      success: true,
      message: "Community updated successfully",
      community: updatedCommunity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community || community.isBlock || !community.isActive) {
      return res.status(404).json({
        success: false,
        message: "Community not available",
      });
    }

    const isBlockedUser = community.blockedUsers.some(
      (user) => String(user) === String(req.user._id),
    );

    if (isBlockedUser) {
      return res.status(403).json({
        success: false,
        message: "You are blocked from this community",
      });
    }

    const alreadyMember = community.members.some(
      (member) => String(member) === String(req.user._id),
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member",
      });
    }

    if (community.privacy === "private") {
      const existingRequest = await CommunityJoinRequest.findOne({
        community: community._id,
        user: req.user._id,
        status: "pending",
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "Join request already sent",
        });
      }

      const request = await CommunityJoinRequest.create({
        community: community._id,
        user: req.user._id,
      });

      return res.status(200).json({
        success: true,
        message: "Join request sent to creator",
        request,
      });
    }

    community.members.push(req.user._id);
    await community.save();

    res.status(200).json({
      success: true,
      message: "Joined community successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    community.members = community.members.filter(
      (member) => String(member) !== String(req.user._id),
    );

    await community.save();

    res.status(200).json({
      success: true,
      message: "Left community successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCommunityBlock = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    community.isBlock = !community.isBlock;
    await community.save();

    res.status(200).json({
      success: true,
      message: community.isBlock
        ? "Community blocked successfully"
        : "Community unblocked successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCommunityActive = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can update community status",
      });
    }

    community.isActive = !community.isActive;
    await community.save();

    res.status(200).json({
      success: true,
      message: community.isActive
        ? "Community activated successfully"
        : "Community deactivated successfully",
      community,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    await community.deleteOne();

    res.status(200).json({
      success: true,
      message: "Community deleted successfully",
      communityId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityJoinRequests = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can view requests",
      });
    }

    const requests = await CommunityJoinRequest.find({
      community: req.params.id,
      status: "pending",
    })
      .populate("user", "name email profileImage city state skillLevel")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCommunityJoinRequest = async (req, res) => {
  try {
    const request = await CommunityJoinRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const community = await Community.findById(request.community);

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can approve requests",
      });
    }

    const alreadyMember = community.members.some(
      (member) => String(member) === String(request.user),
    );

    if (!alreadyMember) {
      community.members.push(request.user);
      await community.save();
    }

    request.status = "approved";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Join request approved",
      requestId: request._id,
      community,
    });

    await request.deleteOne();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCommunityJoinRequest = async (req, res) => {
  try {
    const request = await CommunityJoinRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const community = await Community.findById(request.community);

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can reject requests",
      });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Join request rejected",
      requestId: request._id,
    });

    await request.deleteOne();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUserFromCommunity = async (req, res) => {
  try {
    const { userId } = req.body;

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can block users",
      });
    }

    if (String(community.creator) === String(userId)) {
      return res.status(400).json({
        success: false,
        message: "Creator cannot be blocked from own community",
      });
    }

    const alreadyBlocked = community.blockedUsers.some(
      (blockedUser) => String(blockedUser) === String(userId),
    );

    if (!alreadyBlocked) {
      community.blockedUsers.push(userId);
    }

    community.members = community.members.filter(
      (member) => String(member) !== String(userId),
    );

    await community.save();

    const updatedCommunity = await Community.findById(community._id)
      .populate("game", "name category icon")
      .populate("creator", "name email profileImage role")
      .populate(
        "members",
        "name email profileImage city state skillLevel isOnline",
      )
      .populate(
        "blockedUsers",
        "name email profileImage city state skillLevel",
      );

    res.status(200).json({
      success: true,
      message: "User blocked from community",
      community: updatedCommunity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unblockUserFromCommunity = async (req, res) => {
  try {
    const { userId } = req.body;

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isCreator = String(community.creator) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only creator or admin can unblock users",
      });
    }

    community.blockedUsers = community.blockedUsers.filter(
      (blockedUser) => String(blockedUser) !== String(userId),
    );

    await community.save();

    const updatedCommunity = await Community.findById(community._id)
      .populate("game", "name category icon")
      .populate("creator", "name email profileImage role")
      .populate(
        "members",
        "name email profileImage city state skillLevel isOnline",
      )
      .populate(
        "blockedUsers",
        "name email profileImage city state skillLevel",
      );

    res.status(200).json({
      success: true,
      message: "User unblocked from community",
      community: updatedCommunity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
