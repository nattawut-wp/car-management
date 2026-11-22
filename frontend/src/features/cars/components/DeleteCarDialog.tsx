import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/apiError";
import { deleteCar } from "../api/carsApi";
import type { Car } from "../types";

interface DeleteCarDialogProps {
  car: Car;
  onDeleted: (id: number) => void;
}

export function DeleteCarDialog({ car, onDeleted }: DeleteCarDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCar(car.id);
      toast.success(`Deleted ${car.registrationNumber}`);
      onDeleted(car.id);
      setOpen(false);
    } catch (err) {
      const apiError = toApiError(err);
      // Already deleted elsewhere (e.g. another tab), so drop it from this list too.
      if (apiError.status === 404) {
        onDeleted(car.id);
        setOpen(false);
      }
      toast.error(apiError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${car.registrationNumber}`} />
        }
      >
        <Trash2Icon className="text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this car?</AlertDialogTitle>
          <AlertDialogDescription>
            {car.registrationNumber} ({car.brand} {car.model}) will be removed from the list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2Icon className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
