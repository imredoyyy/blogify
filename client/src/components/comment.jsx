import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DummyProfile from "/icons/dummy-profile.png";
import { formatDbTime } from "../utils/format-db-time";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const Comment = ({ comment, onLike, currentUser }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [comment]);

  return (
    <>
      <div className="flex gap-2.5">
        <Avatar className="cursor-default">
          <AvatarImage src={user?.image || DummyProfile} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="space-y-2.5">
          <div className="space-y-1">
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs",
                !user.username && "capitalize",
              )}
            >
              <span className="font-medium">
                {user.username ? "@" + user.username : user.name}
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-muted-foreground">
                {formatDbTime(comment.createdAt)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {comment.content}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                className={cn(
                  "group size-[30px] rounded-full border-none bg-transparent transition-colors duration-200 active:bg-red-600/20 active:text-red-600/15 md:hover:bg-red-600/20 md:hover:text-red-600/15",
                )}
                variant="outline"
                onClick={() => onLike(comment._id)}
              >
                <Heart
                  className={cn(
                    "size-[14px] transition-colors duration-200 group-hover:stroke-red-600",
                    currentUser &&
                      comment.likes?.includes(currentUser?._id) &&
                      "fill-red-500 stroke-red-500 transition-colors duration-300",
                  )}
                />
              </Button>
              {comment.likes.length > 0 && (
                <div
                  className={cn(
                    "text-sm text-muted-foreground",
                    comment.likes.length > 0 && "",
                  )}
                >
                  {comment.likes.length}
                  {comment.likes.length > 1 ? " Likes" : " Like"}
                </div>
              )}
            </div>
            {(currentUser?._id === comment?.userId ||
              currentUser?.role === "admin") && (
              <>
                <Button
                  variant="outline"
                  className={cn("h-7 p-2 text-xs font-normal")}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className={cn("h-7 p-2 text-xs font-normal")}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};
