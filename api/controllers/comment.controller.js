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

export const getComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { id } = req.user;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(id);

    if (userIndex === -1) {
      comment.numLikes += 1;
      comment.likes.push(id);
      await comment.save();
      return res.status(200).json(comment);
    } else {
      comment.numLikes -= 1;
      comment.likes.splice(userIndex, 1);
      await comment.save();
      return res.status(200).json(comment);
    }
  } catch (err) {
    next(err);
  }
};
