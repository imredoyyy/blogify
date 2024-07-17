import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDocumentTitle } from "../utils/use-document-title";
import { toast } from "sonner";
import {
  FileText,
  Loader2,
  MessageCircleMore,
  Users,
  ArrowUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Link, Navigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DummyProfile from "/icons/dummy-profile.png";
import { formatDbTime } from "../utils/format-db-time";
import { useIsAuthenticated } from "../utils/is-authenticated";

export const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthsUsers, setLastMonthsUsers] = useState(0);
  const [lastMonthsPosts, setLastMonthsPosts] = useState(0);
  const [lastMonthsComments, setLastMonthsComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      const res = await fetch(`/api/user/get-users/${currentUser._id}?limit=5`);

      if (!res.ok) {
        toast.error("Could not get users");
        return;
      }

      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setLastMonthsUsers(data.lastMonthUsers);
    };

    const fetchComments = async () => {
      const res = await fetch("/api/comment/get-comments?limit=5");

      if (!res.ok) {
        toast.error("Could not get comments");
        return;
      }

      const data = await res.json();
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
      setTotalComments(data.totalComments);
      setLastMonthsComments(data.lastMonthsComments);
    };

    const fetchPosts = async () => {
      const res = await fetch("/api/post/get-posts?limit=5");

      if (!res.ok) {
        toast.error("Could not get posts");
        return;
      }

      const data = await res.json();
      setPosts(data.posts);
      setTotalPosts(data.total);
      setLastMonthsPosts(data.lastMonthsPosts);
    };

    const fetchData = async () => {
      if (currentUser.role === "admin") {
        fetchUsers();
      }

      if (currentUser.role === "admin" || currentUser.role === "editor") {
        await Promise.all([fetchComments(), fetchPosts()]);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentUser.role, currentUser._id]);

  useDocumentTitle("Dashboard | Blogify");

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={"/sign-in"} />;
  }

  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "editor")
  ) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <h1 className="font-playfair text-xl font-bold lg:text-2xl">
        Hello, <span>{currentUser?.name}!</span>
      </h1>

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          currentUser.role === "admin" ? "lg:grid-cols-3" : "max-w-3xl",
        )}
      >
        {currentUser.role === "admin" && (
          <div className="flex items-center justify-between gap-6 rounded-lg bg-accent p-4 shadow-lg ring-slate-900 dark:shadow-none">
            <div className="space-y-3.5">
              <div className="space-y-2">
                <h3 className="m-0">Total Users</h3>
                <p>{totalUsers}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-0.5 text-green-500">
                  <ArrowUp className="size-[18px]" />
                  {lastMonthsUsers}
                </span>{" "}
                Last month
              </div>
            </div>
            <Button
              variant="outline"
              className={cn("bg-blue-600 hover:bg-blue-600")}
              size="icon"
              asChild
            >
              <div>
                <Users className="size-5 stroke-slate-100" />
              </div>
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between gap-6 rounded-lg bg-accent p-4 shadow-lg ring-slate-900 dark:shadow-none">
          <div className="space-y-3.5">
            <div className="space-y-2">
              <h3 className="m-0">Total Posts</h3>
              <p>{totalPosts}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-0.5 text-green-500">
                <ArrowUp className="size-[18px]" />
                {lastMonthsPosts}
              </span>{" "}
              Last month
            </div>
          </div>
          <Button
            variant="outline"
            className={cn("bg-lime-500 hover:bg-lime-500")}
            size="icon"
            asChild
          >
            <div>
              <FileText className="size-5 stroke-slate-100" />
            </div>
          </Button>
        </div>

        <div className="flex items-center justify-between gap-6 rounded-lg bg-accent p-4 shadow-lg ring-slate-900 dark:shadow-none">
          <div className="space-y-3.5">
            <div className="space-y-2">
              <h3 className="m-0">Total Comments</h3>
              <p>{totalComments}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-0.5 text-green-500">
                <ArrowUp className="size-[18px]" />
                {lastMonthsComments}
              </span>{" "}
              Last month
            </div>
          </div>
          <Button
            variant="outline"
            className={cn("bg-indigo-600 hover:bg-indigo-600")}
            size="icon"
            asChild
          >
            <div>
              <MessageCircleMore className="size-5 stroke-slate-100" />
            </div>
          </Button>
        </div>
      </div>

      <div className="grid gap-y-6 lg:grid-cols-2 lg:gap-x-4">
        {currentUser.role === "admin" && (
          <div className="space-y-4 rounded-lg bg-accent p-3 shadow-lg ring-slate-900 dark:shadow-none">
            <div className="flex items-center justify-between gap-4 p-4">
              <h3 className="m-0 text-lg font-semibold">Recent Users</h3>
              <Button asChild size="sm">
                <Link to="/dashboard/users">View all</Link>
              </Button>
            </div>
            <Table className="bg-background">
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={user.image || DummyProfile}
                        ></AvatarImage>
                        <AvatarFallback className="bg-slate-600">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="space-y-4 rounded-lg bg-accent p-3 shadow-lg ring-slate-900 dark:shadow-none">
          <div className="flex items-center justify-between gap-4 p-4">
            <h3 className="m-0 text-lg font-semibold">Recent Comments</h3>
            <Button asChild size="sm">
              <Link to="/dashboard/comments">View all</Link>
            </Button>
          </div>
          <Table className="bg-background">
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>{"@" + comment.username}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.numLikes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="space-y-4 rounded-lg bg-accent p-3 shadow-lg ring-slate-900 dark:shadow-none">
          <div className="flex items-center justify-between gap-4 p-4">
            <h3 className="m-0 text-lg font-semibold">Recent Posts</h3>
            <Button asChild size="sm">
              <Link to="/dashboard/posts">View all</Link>
            </Button>
          </div>
          <Table className="bg-background">
            <TableHeader>
              <TableRow>
                <TableHead>Publish Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{formatDbTime(post.createdAt)}</TableCell>
                  <TableCell className="max-w-52">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell>{post.authorName}</TableCell>
                  <TableCell>{post.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
