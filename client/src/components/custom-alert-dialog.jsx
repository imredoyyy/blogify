import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "./ui/button";

export const CustomAlertDialog = ({
  variant,
  triggerText,
  alert,
  alertDesc,
  cancel,
  action,
  onClick,
  className,
}) => {
  return (
    <AlertDialog>
      <Button asChild size="sm" variant={variant} className={cn(className)}>
        <AlertDialogTrigger>{triggerText}</AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert}</AlertDialogTitle>
          <AlertDialogDescription>{alertDesc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
