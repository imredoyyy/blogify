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

export const editComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { id } = req.user;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== id && req.user.role !== "admin") {
      return next(
        errorHandler(403, "You do not have permission to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    res.status(200).json(editedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { id } = req.user;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== id && req.user.role !== "admin") {
      return next(
        errorHandler(403, "You do not have permission to delete this comment")
      );
    }

    await Comment.findByIdAndDelete(commentId);

    if (req.user.role === "admin") {
      console.log("Deleted by admin");
    } else {
      console.log("Deleted by user");
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};
