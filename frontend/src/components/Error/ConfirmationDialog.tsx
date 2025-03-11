// ConfirmationDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useConfirmationStore from "@/components/Contexts/ConfirmationStore";
import { Button } from "../ui/button";

const ConfirmationDialog = () => {
  const { open, title, description, cancelLabel, actionLabel, onAction, closeConfirmation } = useConfirmationStore();

  return (
    <AlertDialog open={open} onOpenChange={closeConfirmation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"} className="w-full">{cancelLabel}</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAction} asChild>
            <Button variant={"outline"} className="w-full text-black bg-teal-500 hover:bg-teal-400">{actionLabel}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;