import Community from "../models/Community.js";
import CommunityPost from "../models/CommunityPost.js";
import CommunityComment from "../models/CommunityComment.js";

// Create Post (Only Community Creator/Admin)
export const createPost = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

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
        message: "Only the community creator can create posts.",
      });
    }

    const post = await CommunityPost.create({
      community: community._id,
      author: req.user._id,
      message: req.body.message,
      image: req.file ? req.file.path : "",
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      "author",
      "name profileImage",
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Posts of Community
export const getPosts = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const posts = await CommunityPost.find({
      community: req.params.communityId,
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const community = await Community.findById(post.community);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isMember = community.members.some(
      (member) => String(member) === String(req.user._id),
    );

    const isCreator = String(community.creator) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isMember && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only community members can comment.",
      });
    }

    const comment = await CommunityComment.create({
      post: post._id,
      author: req.user._id,
      comment: req.body.comment,
    });

    const populatedComment = await CommunityComment.findById(
      comment._id,
    ).populate("author", "name profileImage");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Comments of a Post
export const getComments = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await CommunityComment.find({
      post: req.params.postId,
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const community = await Community.findById(post.community);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isPostAuthor = String(post.author) === String(req.user._id);

    const isCommunityCreator =
      String(community.creator) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isPostAuthor && !isCommunityCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Delete all comments of this post
    await CommunityComment.deleteMany({
      post: post._id,
    });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId: post._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await CommunityComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const post = await CommunityPost.findById(comment.post);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const community = await Community.findById(post.community);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const isCommentAuthor = String(comment.author) === String(req.user._id);

    const isCommunityCreator =
      String(community.creator) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isCommentAuthor && !isCommunityCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentId: comment._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like / Unlike Post
export const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (user) => String(user) === String(req.user._id),
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (user) => String(user) !== String(req.user._id),
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    const updatedPost = await CommunityPost.findById(post._id).populate(
      "author",
      "name profileImage",
    );

    res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Post unliked successfully"
        : "Post liked successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
