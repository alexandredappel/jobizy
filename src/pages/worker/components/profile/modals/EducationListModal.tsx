import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";
import { Education } from "@/types/firebase.types";
import { useToast } from "@/hooks/use-toast";
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

interface EducationListModalProps {
  open: boolean;
  onClose: () => void;
  education: Education[];
  userId: string;
}

const EducationListModal = ({
  open,
  onClose,
  education,
  userId,
}: EducationListModalProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>Education</SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="relative border rounded-lg p-4"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    // Handle delete
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                {/* Education form fields will go here */}
              </div>
            ))}

            <Button
              className="fixed bottom-6 right-6 rounded-full"
              onClick={() => {
                // Handle add new education
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                onClose();
              }}
            >
              Close without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EducationListModal;