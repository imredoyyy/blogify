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

export const getPostComments = async (req, res, next) => {
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
                errorHandler(
                    403,
                    "You do not have permission to edit this comment"
                )
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
                errorHandler(
                    403,
                    "You do not have permission to delete this comment"
                )
            );
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// Get all comments
export const getComments = async (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "editor") {
        return next(
            errorHandler(403, "You do not have privilege to get all comments!")
        );
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.order === "ascending" ? 1 : -1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();

        const now = new Date();
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);

        // If the last month is January, set the year to the previous year
        if (now.getMonth() === 0) {
            lastMonth.setFullYear(now.getFullYear() - 1);
            lastMonth.setMonth(11); // December
        }

        const lastMonthsComments = await Comment.countDocuments({
            createdAt: {
                $gte: lastMonth,
            },
        });

        res.status(200).json({ comments, totalComments, lastMonthsComments });
    } catch (err) {
        next(err);
    }
};
