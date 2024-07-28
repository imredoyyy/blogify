import { Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { handleCopyToClipboard } from "../lib/utils";

export const SharePost = ({ postUrl, postTitle }) => {
  const handleSocialMediaShare = (socialPlatform) => {
    switch (true) {
      case socialPlatform === "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`);
        break;
      case socialPlatform === "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${postTitle}&url=${postUrl}`,
        );
        break;
      case socialPlatform === "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?url=${postUrl}&title=${postTitle}`,
        );
        break;
    }
  };

  const handleCopyPostUrl = async () => {
    try {
      await handleCopyToClipboard(postUrl);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Could not copy to clipboard");
      console.error(error);
    }
  };

  return (
    <div className="not-prose w-full max-w-56 space-y-4 rounded-lg border border-border p-2.5">
      <h3 className="text-base font-medium">Share This Post</h3>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={() => handleSocialMediaShare("facebook")}
          size="icon"
          variant="outline"
          aria-label="Share on Facebook"
          className="size-9"
        >
          <Facebook className="size-5" />
        </Button>
        <Button
          onClick={() => handleSocialMediaShare("twitter")}
          size="icon"
          variant="outline"
          aria-label="Share on Twitter"
          className="size-9"
        >
          <Twitter className="size-5" />
        </Button>
        <Button
          onClick={() => handleSocialMediaShare("linkedin")}
          size="icon"
          variant="outline"
          aria-label="Share on LinkedIn"
          className="size-9"
        >
          <Linkedin className="size-5" />
        </Button>
        <Button
          onClick={handleCopyPostUrl}
          size="icon"
          variant="outline"
          aria-label="Copy post URL"
          className="size-9"
        >
          <Copy className="size-5" />
        </Button>
      </div>
    </div>
  );
};
