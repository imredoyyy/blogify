import DOMPurify from "dompurify";

import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const PostCard = ({ post }) => {
  return (
    <div className="flex w-full max-w-[300px] flex-col overflow-hidden rounded-lg border border-border p-1.5 shadow-md ring-background dark:shadow-none">
      <Link to={`/post/${post?.slug}`} className="group block w-full">
        <img
          className="h-full w-full rounded-lg object-contain transition-transform duration-300 md:group-hover:scale-105"
          src={post?.image}
          alt={post?.title}
        />
      </Link>
      <div className="flex flex-col gap-2.5 p-3">
        <Link to={`/post/${post?.slug}`}>
          <h2 className="m-0 text-base font-semibold">{post?.title}</h2>
        </Link>
        <p
          className="line-clamp-2 text-xs text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.content.slice(0, 120)),
          }}
        />
        <Button asChild size="sm" className="h-8 w-fit text-sm">
          <Link to={`/post/${post?.slug}`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
};
