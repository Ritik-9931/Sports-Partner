import Game from "../models/Game.js";

// Create game
export const createGame = async (req, res) => {
  try {
    const { name, category, icon } = req.body;

    const game = await Game.create({
      name,
      category,
      icon,
      creator: req.user._id,
    });

    const populatedGame = await Game.findById(game._id).populate(
      "creator",
      "name profileImage",
    );

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all games
export const getGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate("creator", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single game
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update game
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    const isCreator = String(game.creator) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    game.name = req.body.name;
    game.category = req.body.category;
    game.icon = req.body.icon;

    await game.save();

    const updatedGame = await Game.findById(game._id).populate(
      "creator",
      "name profileImage",
    );

    res.json({
      success: true,
      game: updatedGame,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete game
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    const isCreator = String(game.creator) === String(req.user._id);

    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await game.deleteOne();

    res.json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
