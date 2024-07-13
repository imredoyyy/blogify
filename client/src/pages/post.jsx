import { Link, useParams } from "react-router-dom";
import { Container } from "../components/container";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PostPageBreadcrumb } from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import { formatDbTime } from "../utils/format-db-time";
import DOMPurify from "dompurify";
import { CommentSection } from "../components/comment-section";

const Post = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/get-posts?slug=${slug}`);
        if (!res.ok) {
          toast.error("Could not get post");
          return;
        }
        const data = await res.json();
        setPost(data.posts[0]);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Loader2 className="size-8 animate-spin lg:size-10" />
      </div>
    );
  }

  const articleContent = document.getElementById("article-content");

  if (articleContent) {
    const links = articleContent.querySelectorAll("a");

    links.forEach((link) => {
      link.removeAttribute("rel");
    });
  }

  return (
    <Container>
      <PostPageBreadcrumb title={post?.title} />
      <article
        itemScope
        itemType="http://schema.org/BlogPosting"
        className="mx-auto flex max-w-3xl flex-col gap-10"
      >
        <div className="flex flex-col gap-3">
          <h1
            itemProp="headline"
            className="text-center font-playfair text-3xl font-bold capitalize lg:text-4xl"
          >
            {post?.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-normal">
            <p itemProp="author" className="text-muted-foreground">
              By <span className="text-foreground">{post?.authorName}</span>
            </p>
            <Separator orientation="vertical" className="h-4" />
            <div itemProp="articleSection" className="text-muted-foreground">
              {post?.categories.length > 1 ? "Categories" : "Category"}:{" "}
              {post?.categories.map((category) => (
                <Link
                  key={category}
                  to={`/search?category=${category}`}
                  className="uppercase text-foreground"
                >
                  {category}
                </Link>
              ))}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div itemProp="dateModified" className="text-muted-foreground">
              Last modified:{" "}
              <span className="text-foreground">
                {formatDbTime(post?.updatedAt)}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-muted-foreground">
              {/* Add an estimated reading time */}
              {Math.round(post?.content.length / 900).toFixed(0)} Mins Read
            </div>
          </div>
        </div>

        <div itemProp="articleBody">
          {post?.image && (
            <div className="mx-auto my-6 h-auto w-full max-w-[650px] rounded-lg border border-border shadow-sm shadow-foreground dark:shadow-muted lg:my-10">
              <img
                src={post?.image}
                alt={post?.title}
                className="size-full rounded-lg dark:shadow-md dark:shadow-muted"
              />
            </div>
          )}

          <div
            id="article-content"
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post?.content),
            }}
          ></div>
        </div>
      </article>
      <CommentSection postId={post?._id} />
    </Container>
  );
};

export default Post;
