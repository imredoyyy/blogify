import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { useDocumentTitle } from "../utils/use-document-title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { formatDbTime } from "../utils/format-db-time";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const DashComments = () => {
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  useDocumentTitle("Users | Blogify");

  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/comment/get-comments");

        if (!response.ok) {
          toast.error("Error fetching comments");
          return;
        }

        const data = await response.json();
        const commentWithUsername = await Promise.all(
          data.comments.map(async (comment) => {
            const userResponse = await fetch(`/api/user/${comment.userId}`);

            if (userResponse.ok) {
              const userData = await userResponse.json();
              return {
                ...comment,
                username: userData.username,
              };
            } else {
              return comment;
            }
          }),
        );

        setComments(commentWithUsername);

        if (data.comments.length < 10) {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.role === "admin" || currentUser.role === "editor") {
      getComments();
    }
  }, [currentUser._id, currentUser.role]);

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);

    try {
      const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setDeletingCommentId(null);
        const data = await res.json();
        toast.error(data.message || "Error deleting comment");
        return;
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
      toast.success("Comment deleted successfully!");
      setDeletingCommentId(null);
    } catch (error) {
      setDeletingCommentId(null);
      toast.error("Error deleting comment!");
      console.error(error);
    }
  };

  const handleLoadMore = async () => {
    const startIndex = comments.length;
    setLoadingMoreComments(true);
    try {
      const res = await fetch(
        `/api/user/get-comments/${currentUser._id}?startIndex=${startIndex}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        toast.error("Error fetching comments");
        return;
      }

      const data = await res.json();

      if (data.comments.length === 0) {
        toast.error("No more comments available");
        setShowMore(false);
      } else {
        setComments((prevComments) => [...prevComments, ...data.comments]);
        setShowMore(data.comments.length >= 10);
      }

      setLoadingMoreComments(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLoadingMoreComments(false);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (currentUser.role !== "admin" && currentUser.role !== "editor") {
    return <Navigate to="/" />;
  }

  return comments?.length > 0 ? (
    <div className="w-full space-y-10 pt-4">
      <h1 className="text-center text-xl font-medium lg:text-3xl">
        All Comments
      </h1>

      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-32">Date Created</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Post Id</TableHead>
              <TableHead>Username</TableHead>
              {currentUser.role === "admin" && <TableHead>Delete</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment._id}>
                <TableCell>{formatDbTime(comment.createdAt)}</TableCell>
                <TableCell>{comment.content}</TableCell>
                <TableCell>{comment.numLikes}</TableCell>
                <TableCell>{comment.postId}</TableCell>
                <TableCell>{"@" + comment.username}</TableCell>
                {currentUser.role === "admin" && (
                  <TableCell>
                    <DeleteCommentPopover
                      commentId={comment._id}
                      onDelete={handleDeleteComment}
                      deletingCommentId={deletingCommentId}
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
              onClick={handleLoadMore}
              disabled={loadingMoreComments}
              className="mx-auto"
            >
              {loadingMoreComments && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>No comments yet</div>
  );
};

const DeleteCommentPopover = ({ commentId, onDelete, deletingCommentId }) => {
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
              Are you sure you want <br /> to delete this comment?
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={() => onDelete(commentId)}>
                {deletingCommentId ? (
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

export default DashComments;
