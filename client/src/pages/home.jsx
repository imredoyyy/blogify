import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Container } from "../components/container";
import { PostCard } from "../components/post-card";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/post/get-posts?limit=9");

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPosts(data.posts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-7 animate-spin" />
      </div>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-[600px] space-y-4">
        <h1 className="text-center font-playfair text-3xl font-bold">
          Welcome to Blogify
        </h1>
        <p className="text-center text-muted-foreground">
          Here you will find articles and tutorials about{" "}
          <span className="text-foreground">Web Development</span>, programming
          languages, and more.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-10">
        <div className="space-y-12">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-10">
              <h2 className="text-center font-playfair text-3xl font-bold lg:text-4xl">
                Recent Posts
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )}

          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-10">
              <h2 className="text-center font-playfair text-3xl font-bold lg:text-4xl">
                JavaScript
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {posts
                  .filter((post) =>
                    post.categories.some(
                      (category) => category.toLowerCase() === "javascript",
                    ),
                  )
                  .map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
              </div>
            </div>
          )}
        </div>

        <Button asChild className="mx-auto flex w-full max-w-[10rem]">
          <Link to="/search">View More</Link>
        </Button>
      </div>
    </Container>
  );
};

export default Home;
