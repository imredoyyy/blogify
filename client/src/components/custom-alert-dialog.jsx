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
  actionVariant,
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
          <Button asChild variant={actionVariant} onClick={onClick}>
            <AlertDialogAction>{action}</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
