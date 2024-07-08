import Post from "../models/post";

export const sanitizeSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const slugExist = async (text) => {
  const slug = sanitizeSlug(text);

  const existingPost = await Post.findOne({ slug });

  return !!existingPost;
};
