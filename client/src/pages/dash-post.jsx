import { formatDbTime } from "../utils/format-db-time";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Loader2 } from "lucide-react";
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
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
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
        console.log(data);
        setUserPosts(data.posts);
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

  return (
    <div className="w-full">
      {(currentUser.role === "admin" || currentUser.role === "editor") &&
      userPosts.length > 0 ? (
        <div className="table-auto scrollbar scrollbar-track-muted scrollbar-thumb-muted-foreground">
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
                  <TableCell>{formatDbTime(post.updatedAt)}</TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.authorName}</TableCell>
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
        </div>
      ) : (
        <div>You don&apos;t have any posts.</div>
      )}
    </div>
  );
};

export default DashPost;
