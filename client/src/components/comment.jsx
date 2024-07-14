import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import DummyProfile from "/icons/dummy-profile.png";
import { formatDbTime } from "../utils/format-db-time";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const Comment = ({ comment }) => {
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
          <div className="text-sm text-muted-foreground">{comment.content}</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="icon"
              className={cn(
                "size-6 border-none bg-transparent transition-colors duration-200 hover:bg-secondary/25",
              )}
              variant="outline"
              onClick={() => {
                comment.likes.includes(user?._id)
                  ? null
                  : comment.likes.push(user?._id);
              }}
            >
              <Heart
                className={cn(
                  "size-4",
                  comment.likes.includes(user?._id) && "fill-red-500",
                )}
              />
            </Button>
            {comment.likes.length > 0 && (
              <div
                className={cn(
                  "text-xs text-muted-foreground transition-transform duration-300",
                )}
              >
                {comment.likes.length} like
              </div>
            )}
          </div>
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
        </div>
      </div>
    </div>
  );
};
