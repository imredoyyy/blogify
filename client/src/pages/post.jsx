import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/container";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";
import { formatDbTime } from "../utils/format-db-time";
import DOMPurify from "dompurify";
import { CommentSection } from "../components/comment-section";
import { PostCard } from "../components/post-card";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Post = () => {
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

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
        if (!data.posts[0]) {
          navigate("*", { replace: true });
          return;
        }

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

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?limit=3`);

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setRecentPosts(data.posts);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    };
    fetchRecentPosts();
  }, []);

  const generateExcerpt = (content) => {
    const sanitizeText = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

    const excerpt = sanitizeText
      .substring(0, 200)
      .split(" ")
      .slice(0, -1)
      .join(" ")
      .concat("...");
    return excerpt;
  };

  if (loading) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Loader2 className="size-8 animate-spin lg:size-10" />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Container>
        {post && (
          <>
            <Helmet>
              <title>{post?.title} | Blogify</title>
              <meta property="og:title" content={post.title} />
              {post?.image && <meta property="og:image" content={post.image} />}
              <meta property="og:type" content="article" />
              <meta
                property="og:description"
                content={post?.excerpt || generateExcerpt(post?.content)}
              />
              {post?.categories.map((category) => (
                <meta
                  key={category}
                  property="article:tag"
                  content={category}
                />
              ))}
            </Helmet>
            <div className="mx-auto max-w-4xl">
              <article
                itemScope
                itemType="http://schema.org/BlogPosting"
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-3">
                  <h1
                    itemProp="headline"
                    className="text-center font-playfair text-3xl font-bold capitalize lg:text-4xl"
                  >
                    {post?.title}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-normal">
                    <div itemProp="author" className="text-muted-foreground">
                      By{" "}
                      <span className="text-foreground">
                        {post?.authorName}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div
                      itemProp="articleSection"
                      className="text-muted-foreground"
                    >
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
                    <div
                      itemProp="dateModified"
                      className="text-muted-foreground"
                    >
                      Last modified:{" "}
                      <span className="text-foreground">
                        {formatDbTime(post?.updatedAt)}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="text-muted-foreground">
                      {/* Add an estimated reading time */}
                      {Math.round(post?.content.length / 900).toFixed(0)} Mins
                      Read
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
                <CommentSection postId={post?._id} />
              </article>

              {recentPosts.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-center text-2xl font-medium lg:text-3xl">
                    Recent Posts
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {recentPosts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </HelmetProvider>
  );
};

export default Post;
