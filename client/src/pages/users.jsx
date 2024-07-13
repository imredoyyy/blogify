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
import DummyProfile from "/icons/dummy-profile.png";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  useDocumentTitle("Users | Blogify");

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/get-users/${currentUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          switch (response.status) {
            case 403:
              toast.error("You do not have permission to perform this action");
              break;
            default:
              toast.error("Error fetching users");
              break;
          }
          return;
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.role === "admin") {
      getUsers();
    }
  }, [currentUser._id, currentUser.role]);

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);

    try {
      const res = await fetch(`/api/user/delete-other-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        setDeletingUserId(null);
        toast.error("Error deleting user!");
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
      setDeletingUserId(null);
    } catch (error) {
      setDeletingUserId(null);
      toast.error("Error deleting user!");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-full space-y-10 pt-4">
      <h1 className="text-center text-xl font-medium lg:text-3xl">All Users</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-32">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profile Image</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Auth Provider</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="capitalize">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="size-10">
                  <img
                    src={user.image ? user.image : DummyProfile}
                    className="size-full rounded-full object-cover"
                    alt="profile"
                  />
                </div>
              </TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDbTime(user.createdAt)}
              </TableCell>
              <TableCell className="capitalize">{user.authProvider}</TableCell>
              <TableCell>
                <DeleteUserPopover
                  userId={user._id}
                  onDelete={handleDeleteUser}
                  deletingUserId={deletingUserId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DeleteUserPopover = ({ userId, onDelete, deletingUserId }) => {
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
              Are you sure you want <br /> to delete this user?
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={() => onDelete(userId)}>
                {deletingUserId ? (
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

export default Users;
