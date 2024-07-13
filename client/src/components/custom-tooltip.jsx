import { useMedia } from "react-use";

import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CircleHelp } from "lucide-react";

export const ToolTip = ({ text, customIcon }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-3 border-none"
          >
            {customIcon ? customIcon : <CircleHelp className="size-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PopOver = ({ text, customIcon }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-3 border-none"
        >
          {customIcon ? customIcon : <CircleHelp className="size-3" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 text-xs">{text}</PopoverContent>
    </Popover>
  );
};

const CustomTooltip = ({ text, customIcon }) => {
  const isMobile = useMedia("(max-width: 1024px)");

  return isMobile ? (
    <PopOver text={text} customIcon={customIcon} />
  ) : (
    <ToolTip text={text} customIcon={customIcon} />
  );
};

export default CustomTooltip;
