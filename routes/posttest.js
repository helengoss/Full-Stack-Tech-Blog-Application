// create a new router
const app = require("express").Router();

// import the models
const { Post } = require("../models/index");

// import authentication middleware
const authenticateToken = require("../middleware/authenticateToken");

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.destroy({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    res.status(500).json(err);
  }
});