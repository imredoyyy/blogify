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

    const newPost = new Post({
      authorId: id,
      authorName: user.name,
      title,
      category,
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
