const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  commentId: {
    type: String,
  },
  user: {
    type: String,
  },
  content: {
    type: String,
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Comment", commentSchema);