import { formatDbTime } from "../utils/format-db-time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Loader, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser._id;
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/get-posts?userId=${userId}`);

        if (!res.ok) {
          toast.error("Something went wrong!");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUserPosts(data.posts);
        if (data.posts.length < 10) {
          setShowMore(false);
        }
        console.log(data);
        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong!");
        setLoading(false);
        console.error(error);
      }
    };

    if (currentUser.role === "admin" || currentUser.role === "editor") {
      fetchPosts();
    }
  }, [userId, currentUser.role]);

  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "editor")
  ) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin" />
      </div>
    );
  }

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    setLoadingMorePosts(true);

    try {
      const res = await fetch(
        `/api/post/get-posts?userId=${userId}&startIndex=${startIndex}`,
      );
      if (!res.ok) {
        toast.error("Something went wrong!");
        setLoadingMorePosts(false);
        return;
      }

      const data = await res.json();
      if (data.posts.length === 0) {
        toast.error("No more posts available!");
        setShowMore(false);
      }

      setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
      if (data.posts.length < 10) {
        setShowMore(false);
      }

      setLoadingMorePosts(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      {(currentUser.role === "admin" || currentUser.role === "editor") &&
      userPosts.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Modified</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                {(currentUser.role === "admin" ||
                  currentUser.role === "editor") && <TableHead>Edit</TableHead>}
                {currentUser.role === "admin" && <TableHead>Delete</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {formatDbTime(post.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-slate-700 hover:text-foreground dark:text-slate-300 dark:hover:text-accent-foreground"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {post.category}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {post.authorName}
                  </TableCell>
                  {(currentUser.role === "admin" ||
                    currentUser.role === "editor") && (
                    <TableCell>
                      <Button
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className={cn("cursor-pointer")}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  )}
                  {currentUser.role === "admin" && (
                    <TableCell>
                      <Button variant="destructive">Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <div className="mt-4 flex w-full justify-center">
              <Button
                onClick={handleShowMore}
                disabled={loading}
                className="mx-auto"
              >
                {loadingMorePosts && (
                  <Loader className="mr-2 size-4 animate-spin" />
                )}
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>You don&apos;t have any posts.</div>
      )}
    </div>
  );
};

export default DashPost;
