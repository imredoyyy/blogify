import { errorHandler } from "../utils/error-handler";
import Post from "../models/post";
import User from "../models/user";
import { slugExist, sanitizeSlug } from "../utils/post-utils";

export const createPost = async (req, res, next) => {
  const { title, category, slug, content, excerpt, image } = req.body;
  const { id, role } = req.user;

  if (role !== "admin" && role !== "editor") {
    return next(
      errorHandler(403, "You do not have privilege to create a post!")
    );
  }

  if (!title || !category || !content) {
    return next(errorHandler(400, "Please provide all the required fields!"));
  }

  const generatedSlug = sanitizeSlug(slug || title);

  try {
    if (await slugExist(generatedSlug)) {
      return next(
        errorHandler(409, "This slug already exists. Use another one.")
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const categories = Array.isArray(category)
      ? category
      : category.split(",").map((cat) => cat.trim());

    const newPost = new Post({
      authorId: id,
      authorName: user.name,
      authorUsername: user.username,
      title,
      category: categories,
      excerpt,
      slug: generatedSlug,
      content,
      image,
    });

    await newPost.save();

    res.status(201).json({ message: "Post successful", post: newPost });
  } catch (error) {
    next(error);
  }
};

// Endpoint to get posts by category
export const getPostsByCategory = async (req, res, next) => {
  const { category } = req.params;

  try {
    const posts = await Post.find({ category });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === "ascending" ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: { $in: [req.query.category] } }),
      ...(slug && { slug: slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchQuery && {
        $or: [
          { title: { $regex: req.query.searchQuery, $options: "i" } },
          { content: { $regex: req.query.searchQuery, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({
        updatedAt: sortDirection,
      })
      .skip(startIndex)
      .limit(limit);

    const total = await Post.countDocuments(query);

    const now = new Date();

    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    if (now.getMonth() === 0) {
      lastMonth.setFullYear(now.getFullYear() - 1);
      lastMonth.setMonth(11); // December
    }

    const lastMonthsPosts = await Post.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    res.status(200).json({
      posts,
      total,
      lastMonthsPosts,
    });
  } catch (error) {
    next(error);
  }
};
