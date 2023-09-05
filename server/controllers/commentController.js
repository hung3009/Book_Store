const Comment = require("../models/comment");

const commentController = {
  addComment: async (req, res) => {
    try {
        const { productId, user, content } = req.body;
        const newComment = new Comment({ productId, user, content, likes: 0, dislikes: 0 });
        await newComment.save();
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getCommentsByProductId: async (req,res) => {
    try {
        const productId = req.params.productId;
        const comments = await Comment.find({ productId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
module.exports = commentController;
