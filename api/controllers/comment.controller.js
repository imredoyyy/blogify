import Post from "../models/post";
import Comment from "../models/comment";
import { errorHandler } from "../utils/error-handler";

export const createComment = async (req, res, next) => {
  const { postId, userId, content } = req.body;

  if (!userId) {
    return next(errorHandler(403, "You must sign in to comment"));
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const newComment = new Comment({
      userId,
      postId,
      content,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (err) {
    next(err);
  }
};
