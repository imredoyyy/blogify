import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        authorId: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
        },
        authorUsername: {
            type: String,
        },
        slug: {
            type: String,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            default: [],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: {
            type: String,
        },
        image: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const Post = mongoose.models?.Post || mongoose.model("Post", PostSchema);

export default Post;
