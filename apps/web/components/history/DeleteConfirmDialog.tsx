"use client";

import { useState } from "react";
import { deleteSession } from "@/app/actions/history";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  sessionId: string;
  sessionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (sessionId: string) => void;
}

export function DeleteConfirmDialog({
  sessionId,
  sessionTitle,
  open,
  onOpenChange,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await deleteSession(sessionId);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.(sessionId);
        toast.success("Conversation supprimée");
        onOpenChange(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      setError("Impossible de supprimer la conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setError(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la conversation</DialogTitle>
          <DialogDescription className="break-words">
            Voulez-vous vraiment supprimer «{" "}
            <span className="break-all sm:break-words">{sessionTitle}</span>{" "}
            » ? Cette action est irréversible et tous les messages de cette
            session seront définitivement supprimés.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
