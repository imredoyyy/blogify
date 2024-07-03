import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export const ButtonWithIcon = ({
  iconSrc,
  iconAlt,
  label,
  onClick,
  className,
  props,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={cn(
        "w-full gap-2 text-sm text-[#7e8ca0] hover:text-muted-foreground",
        className,
      )}
      {...props}
    >
      <img src={iconSrc} alt={iconAlt} width={24} height={24} />
      <span>{label}</span>
    </Button>
  );
};
