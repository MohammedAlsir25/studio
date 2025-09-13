"use client"

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/hooks/use-data";

interface DeleteExpenseDialogProps {
  expenseId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DeleteExpenseDialog({ expenseId, isOpen, setIsOpen }: DeleteExpenseDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { deleteExpense } = useData();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteExpense(expenseId);
        toast({ title: "Expense Deleted", description: "Your expense has been successfully deleted." });
        setIsOpen(false);
      } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to delete expense." });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            expense from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
