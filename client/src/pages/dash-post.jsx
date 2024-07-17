import { formatDbTime } from "../utils/format-db-time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../components/ui/dropdown-menu";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser._id;
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [viewingAllPosts, setViewingAllPosts] = useState(true); // Admin can view all posts

  const navigate = useNavigate();

  useEffect(() => {
    setShowMore(true);
    setUserPosts([]);
    setLoading(true);

    const fetchPosts = async (fetchAll = false) => {
      setLoading(true);

      try {
        const api = fetchAll
          ? "/api/post/get-posts"
          : `/api/post/get-posts?userId=${userId}`;
        const res = await fetch(api);

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

        setLoading(false);
      } catch (error) {
        toast.error("Something went wrong!");
        setLoading(false);
        console.error(error);
      }
    };

    if (currentUser.role === "admin" || currentUser.role === "editor") {
      fetchPosts(viewingAllPosts);
    }
  }, [currentUser.role, userId, viewingAllPosts]);

  const handleShowMore = async (fetchAllPosts = false) => {
    const startIndex = userPosts.length;
    setLoadingMorePosts(true);

    try {
      const api = fetchAllPosts
        ? `/api/post/get-posts?startIndex=${startIndex}`
        : `/api/post/get-posts?userId=${userId}&startIndex=${startIndex}`;

      const res = await fetch(api);

      if (!res.ok) {
        toast.error("Something went wrong!");
        setLoadingMorePosts(false);
        return;
      }

      const data = await res.json();

      if (data.posts.length === 0) {
        toast.error("No more posts available!");
        setShowMore(false);
      } else {
        setUserPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setShowMore(data.posts.length >= 10);
      }

      setLoadingMorePosts(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setLoadingMorePosts(false);
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    setDeletingPostId(postId);

    try {
      const res = await fetch(`/api/post/delete-post/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        setDeletingPostId(null);
        toast.error("Error deleting post!");
        return;
      }

      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId),
      );
      toast.success("Post deleted successfully!");
      setDeletingPostId(null);
    } catch (error) {
      setDeletingPostId(null);
      toast.error("Error deleting post!");
      console.error(error);
    }
  };

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

  return (
    <div
      className={cn(
        "w-full",
        (currentUser.role === "admin" || currentUser.role === "editor") &&
          "space-y-10 pt-4",
      )}
    >
      {(currentUser.role === "admin" || currentUser.role === "editor") && (
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => {
              setViewingAllPosts(true);
            }}
            className={cn(
              !viewingAllPosts &&
                "border border-muted-foreground bg-transparent text-foreground transition-colors duration-300 hover:text-background",
            )}
          >
            All Posts
          </Button>
          <Button
            onClick={() => {
              setViewingAllPosts(false);
            }}
            className={cn(
              viewingAllPosts &&
                "border border-muted-foreground bg-transparent text-foreground transition-colors duration-300 hover:text-background",
            )}
          >
            My Posts
          </Button>
        </div>
      )}
      {(currentUser.role === "admin" || currentUser.role === "editor") &&
      userPosts.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publish Date</TableHead>
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
                  <TableCell>{formatDbTime(post.createdAt)}</TableCell>
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
                  <TableCell className="capitalize text-slate-700 dark:text-slate-300">
                    {post.categories.map((category) => category).join(", ")}
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
                      <DeletePostPopover
                        postId={post._id}
                        onDelete={handleDelete}
                        deletingPostId={deletingPostId}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <div className="mt-4 flex w-full justify-center">
              <Button
                onClick={() => handleShowMore(viewingAllPosts)}
                disabled={loadingMorePosts}
                className="mx-auto"
              >
                {loadingMorePosts && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
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

const DeletePostPopover = ({ postId, onDelete, deletingPostId }) => {
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="destructive"
          onClick={() => setShowDeletePopover(true)}
        >
          Delete
        </Button>
      </DropdownMenuTrigger>
      {showDeletePopover && (
        <DropdownMenuContent>
          <div className="flex flex-col gap-2 p-2">
            <p className="text-center text-sm">
              Are you sure you want <br /> to delete this post?
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={() => onDelete(postId)}>
                {deletingPostId === postId ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-5" />
                )}
                Delete
              </Button>
              <Button
                onClick={() => {
                  setShowDeletePopover(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default DashPost;
