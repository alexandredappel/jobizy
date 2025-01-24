import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { WorkExperience } from "@/types/firebase.types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EnhancedDatePicker } from "@/components/ui/enhanced-date-picker";
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
import { doc, deleteDoc, collection, addDoc, updateDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WorkExperienceListModalProps {
  open: boolean;
  onClose: () => void;
  experiences: WorkExperience[];
  userId: string;
}

interface ExperienceForm {
  id?: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentPosition: boolean;
}

const WorkExperienceListModal = ({
  open,
  onClose,
  experiences,
  userId,
}: WorkExperienceListModalProps) => {
  const [localExperiences, setLocalExperiences] = useState<ExperienceForm[]>(() =>
    experiences.map(exp => ({
      id: exp.id,
      companyName: exp.company,
      position: exp.position,
      startDate: exp.start_date.toDate(),
      endDate: exp.end_date?.toDate(),
      isCurrentPosition: !exp.end_date
    }))
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleAddExperience = () => {
    console.log('Adding new experience');
    setLocalExperiences(prev => [...prev, {
      companyName: '',
      position: '',
      startDate: new Date(),
      isCurrentPosition: false
    }]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteExperience = async (index: number) => {
    console.log('Deleting experience at index:', index);
    const experience = localExperiences[index];
    if (experience.id) {
      try {
        await deleteDoc(doc(db, 'work_experiences', experience.id));
        toast({
          title: "Experience deleted",
          description: "Work experience has been removed successfully"
        });
      } catch (error) {
        console.error('Error deleting experience:', error);
        toast({
          title: "Error",
          description: "Failed to delete work experience",
          variant: "destructive"
        });
        return;
      }
    }
    
    setLocalExperiences(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleUpdateField = (index: number, field: keyof ExperienceForm, value: any) => {
    console.log('Updating field:', field, 'with value:', value, 'at index:', index);
    setLocalExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    console.log('Starting save changes process');
    setIsLoading(true);
    
    try {
      // Validate all experiences
      for (const exp of localExperiences) {
        if (!exp.companyName || !exp.position || !exp.startDate) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      const batch = writeBatch(db);
      const experiencesRef = collection(db, 'work_experiences');

      // Delete all existing experiences first
      console.log('Deleting existing experiences');
      for (const exp of experiences) {
        if (exp.id) {
          const docRef = doc(db, 'work_experiences', exp.id);
          batch.delete(docRef);
        }
      }

      // Add all current experiences as new documents
      console.log('Adding new/updated experiences');
      for (const exp of localExperiences) {
        const experienceData = {
          user_id: userId,
          company: exp.companyName,
          position: exp.position,
          start_date: Timestamp.fromDate(exp.startDate),
          end_date: exp.isCurrentPosition ? null : exp.endDate ? Timestamp.fromDate(exp.endDate) : null,
          updated_at: Timestamp.now(),
          created_at: Timestamp.now()
        };

        const newDocRef = doc(experiencesRef);
        batch.set(newDocRef, experienceData);
      }

      // Commit all changes in one batch
      await batch.commit();
      console.log('Batch commit successful');

      toast({
        title: "Success",
        description: "Work experiences updated successfully"
      });
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving experiences:', error);
      toast({
        title: "Error",
        description: "Failed to save work experiences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Work Experience</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 pb-6">
              {localExperiences.map((exp, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg p-4 space-y-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleDeleteExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={exp.companyName}
                      onChange={(e) => handleUpdateField(index, 'companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => handleUpdateField(index, 'position', e.target.value)}
                      placeholder="Enter position"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <EnhancedDatePicker
                      date={exp.startDate}
                      onSelect={(date) => date && handleUpdateField(index, 'startDate', date)}
                      disabled={(date) =>
                        date > new Date() || (exp.endDate && date > exp.endDate)
                      }
                      label="Select start date"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={exp.isCurrentPosition}
                      onCheckedChange={(checked) => {
                        handleUpdateField(index, 'isCurrentPosition', checked);
                        if (checked) {
                          handleUpdateField(index, 'endDate', undefined);
                        }
                      }}
                    />
                    <Label>Current Position</Label>
                  </div>

                  {!exp.isCurrentPosition && (
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <EnhancedDatePicker
                        date={exp.endDate}
                        onSelect={(date) => date && handleUpdateField(index, 'endDate', date)}
                        disabled={(date) =>
                          date > new Date() || date < exp.startDate
                        }
                        label="Select end date"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t">
            <div className="flex justify-between items-center w-full">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleAddExperience}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                className="ml-auto"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </SheetFooter>
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
                setHasUnsavedChanges(false);
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

export default WorkExperienceListModal;