import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import DummyImage from "/icons/dummy-profile.png";
import { Form, FormField, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import CustomTooltip from "./custom-tooltip";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [remainingChars, setRemainingChars] = useState(200);

  const form = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const handleCommentChange = (e) => {
    const commentLength = e.target.value.length;
    setRemainingChars(200 - commentLength);
  };

  const isEmptyTextField = form.getValues("comment").trim() === "";

  const handleCommentSubmit = async (data) => {
    setSubmittingComment(true);

    try {
      const response = await fetch("/api/comment/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: currentUser._id,
          content: data.comment,
        }),
      });

      if (!response.ok) {
        toast.error("Error submitting comment.");
        return;
      }

      const commentData = await response.json();
      form.reset();
      console.log(commentData);
      toast.success("Comment submitted successfully");

      setComments([...comments, commentData.comment]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-5">
      {currentUser ? (
        <div className="flex items-center gap-2">
          <Link to="/dashboard/profile">
            <img
              src={currentUser.image ? currentUser.image : DummyImage}
              className="size-8 rounded-full"
            />
          </Link>
          <div className="text-sm text-muted-foreground">
            Signed in as:{" "}
            <Link
              to="/dashboard/profile"
              className="font-medium text-foreground"
            >
              {currentUser.username
                ? "@" + currentUser.username
                : currentUser.name}
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Link to="/sign-in">Sign in</Link> to comment
        </div>
      )}

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCommentSubmit)}
            className="space-y-4 rounded-lg border border-slate-400 p-4 shadow-xl shadow-slate-500/20 dark:border-slate-700 dark:shadow-lg dark:shadow-border/30"
          >
            <FormField
              name="comment"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="comment">Comment</Label>
                    <CustomTooltip text="Comment must be under 200 characters." />
                  </div>
                  <Textarea
                    id="comment"
                    placeholder="Write a comment..."
                    maxLength={200}
                    className="border-muted-foreground/50 dark:border-muted-foreground/30"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleCommentChange(e);
                    }}
                  />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={submittingComment || !currentUser || isEmptyTextField}
              >
                {submittingComment && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}{" "}
                Submit
              </Button>
              {!isEmptyTextField && (
                <div className="text-sm tabular-nums text-muted-foreground">
                  {remainingChars + " characters left"}
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div>
        {comments.length > 0 ? <div></div> : <div>No comments yet.</div>}
      </div>
    </div>
  );
};
