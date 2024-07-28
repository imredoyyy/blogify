import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../utils/use-document-title";

import { Container } from "../components/container";
import { toast } from "sonner";
import { PostCard } from "../components/post-card";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const SearchPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchQuery");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`/api/post/get-posts?searchQuery=${searchQuery}`);

      if (!res.ok) {
        toast.error("Nothing found with that search term");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPosts(data.posts);

      if (data.posts.length < 10) {
        setShowMore(false);
      }

      setLoading(false);
    };

    if (searchQuery) {
      fetchPosts();
    }
  }, [searchQuery]);

  useDocumentTitle(
    searchQuery
      ? `Search results for "${searchQuery}" | Blogify`
      : "Search | Blogify",
  );

  const handleShowMore = async () => {
    const startIndex = posts.length;
    setLoadingMore(true);

    const res = await fetch(
      `/api/post/get-posts?searchQuery=${searchQuery}&startIndex=${startIndex}`,
    );

    if (!res.ok) {
      toast.error("Error loading more posts.");
      setLoadingMore(false);
      return;
    }

    const data = await res.json();

    if (data.posts.length === 0) {
      toast.error("No more posts available.");
      setShowMore(false);
      setLoadingMore(false);
      return;
    } else {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setShowMore(data.posts.length >= 10);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin" />
      </div>
    );
  }

  return (
    <Container>
      <div className="mx-auto w-full max-w-4xl space-y-10">
        {searchQuery && (
          <div className="flex w-full items-center justify-between">
            <div className="text-left font-playfair text-2xl font-bold lg:text-4xl">
              Search results for "{searchQuery}"
            </div>

            <div className="text-lg font-medium">
              {posts.length > 0 && posts.length} results found
            </div>
          </div>
        )}

        {searchQuery && posts.length > 0 ? (
          <>
            <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {showMore && (
              <Button disabled={loadingMore} onClick={handleShowMore}>
                {loadingMore && (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                )}
                Show More
              </Button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center text-xl font-medium lg:text-2xl">
            {searchQuery === null || searchQuery === ""
              ? "No search term provided"
              : `Nothing results found for ${searchQuery}`}
          </div>
        )}
      </div>
    </Container>
  );
};

export default SearchPage;
