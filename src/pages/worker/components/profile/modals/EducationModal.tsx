import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Education } from "@/types/firebase.types";
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
import { doc, deleteDoc, collection, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  education: Education[];
  userId: string;
}

interface EducationForm {
  id?: string;
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  isCurrentStudy: boolean;
}

const EducationModal = ({
  open,
  onClose,
  education,
  userId,
}: EducationModalProps) => {
  const [localEducation, setLocalEducation] = useState<EducationForm[]>(() =>
    education.map(edu => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      startDate: edu.start_date.toDate(),
      endDate: edu.end_date?.toDate(),
      isCurrentStudy: !edu.end_date
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

  const handleAddEducation = () => {
    console.log('Adding new education');
    setLocalEducation(prev => [...prev, {
      institution: '',
      degree: '',
      startDate: new Date(),
      isCurrentStudy: false
    }]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteEducation = async (index: number) => {
    console.log('Deleting education at index:', index);
    const education = localEducation[index];
    if (education.id) {
      try {
        await deleteDoc(doc(db, 'education', education.id));
        toast({
          title: "Education deleted",
          description: "Education has been removed successfully"
        });
      } catch (error) {
        console.error('Error deleting education:', error);
        toast({
          title: "Error",
          description: "Failed to delete education",
          variant: "destructive"
        });
        return;
      }
    }
    
    setLocalEducation(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleUpdateField = (index: number, field: keyof EducationForm, value: any) => {
    console.log('Updating field:', field, 'with value:', value, 'at index:', index);
    setLocalEducation(prev => prev.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    console.log('Saving changes to Firebase');
    setIsLoading(true);
    try {
      // Validate all education entries
      for (const edu of localEducation) {
        if (!edu.institution || !edu.degree || !edu.startDate) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      // Save all education entries
      for (const edu of localEducation) {
        const educationData = {
          user_id: userId,
          institution: edu.institution,
          degree: edu.degree,
          start_date: Timestamp.fromDate(edu.startDate),
          end_date: edu.isCurrentStudy ? null : edu.endDate ? Timestamp.fromDate(edu.endDate) : null,
          updatedAt: Timestamp.now()
        };

        if (edu.id) {
          await updateDoc(doc(db, 'education', edu.id), educationData);
        } else {
          await addDoc(collection(db, 'education'), {
            ...educationData,
            createdAt: Timestamp.now()
          });
        }
      }

      toast({
        title: "Success",
        description: "Education updated successfully"
      });
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col h-[90vh] w-[95vw] md:w-[50vw] max-w-[95vw] p-0 gap-0 sm:px-6 relative overflow-hidden">
          <DialogHeader className="px-4 sm:px-6 pt-6 mb-8 flex-shrink-0">
            <h2 className="text-2xl font-bold text-center mb-8">Education</h2>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-20">
            <div className="space-y-6">
              {localEducation.map((edu, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg p-4 space-y-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleDeleteEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleUpdateField(index, 'institution', e.target.value)}
                      placeholder="Enter institution name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleUpdateField(index, 'degree', e.target.value)}
                      placeholder="Enter degree"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={edu.isCurrentStudy}
                      onCheckedChange={(checked) => {
                        handleUpdateField(index, 'isCurrentStudy', checked);
                        if (checked) {
                          handleUpdateField(index, 'endDate', undefined);
                        }
                      }}
                    />
                    <Label>Current Study</Label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Label>Start Date</Label>
                      </div>
                      {!edu.isCurrentStudy && (
                        <div className="flex-1">
                          <Label>End Date</Label>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <EnhancedDatePicker
                          date={edu.startDate}
                          onSelect={(date) => date && handleUpdateField(index, 'startDate', date)}
                          disabled={(date) =>
                            date > new Date() || (edu.endDate && date > edu.endDate)
                          }
                          label="Select start date"
                        />
                      </div>
                      {!edu.isCurrentStudy && (
                        <div className="flex-1">
                          <EnhancedDatePicker
                            date={edu.endDate}
                            onSelect={(date) => date && handleUpdateField(index, 'endDate', date)}
                            disabled={(date) =>
                              date > new Date() || date < edu.startDate
                            }
                            label="Select end date"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full fixed bottom-24 right-8 bg-accent hover:bg-accent/90 border-0 z-50"
            onClick={handleAddEducation}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>

          <div className="border-t p-4 sm:px-6 bg-background flex-shrink-0">
            <div className="flex justify-start">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

export default EducationModal;
