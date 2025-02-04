import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { doc, deleteDoc, collection, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          title: t('common.toast.success'),
          description: t('worker.profile.modals.workExperience.toast.deleteSuccess')
        });
      } catch (error) {
        console.error('Error deleting experience:', error);
        toast({
          title: t('common.toast.error'),
          description: t('worker.profile.modals.workExperience.toast.deleteError'),
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
            title: t('common.toast.error'),
            description: t('worker.profile.modals.workExperience.validation.error'),
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
        title: t('common.toast.success'),
        description: t('worker.profile.modals.workExperience.toast.updateSuccess')
      });
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving experiences:', error);
      toast({
        title: t('common.toast.error'),
        description: t('worker.profile.modals.workExperience.toast.updateError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="flex flex-col h-[90vh] w-[95vw] md:h-[70vh] md:w-[50vw] max-w-[95vw] p-0 gap-0 sm:px-6 overflow-hidden">
          <DialogHeader className="px-4 sm:px-6 pt-6 mb-8 flex-shrink-0">
            <h2 className="text-2xl font-bold text-center mb-8">
              {t('worker.profile.modals.workExperience.title')}
            </h2>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-20">
            <div className="space-y-6">
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
                    <Label>{t('worker.profile.modals.workExperience.companyName.label')}</Label>
                    <Input
                      value={exp.companyName}
                      onChange={(e) => handleUpdateField(index, 'companyName', e.target.value)}
                      placeholder={t('worker.profile.modals.workExperience.companyName.placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('worker.profile.modals.workExperience.position.label')}</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => handleUpdateField(index, 'position', e.target.value)}
                      placeholder={t('worker.profile.modals.workExperience.position.placeholder')}
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
                    <Label>{t('worker.profile.modals.workExperience.currentPosition')}</Label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Label>{t('worker.profile.modals.workExperience.dates.start')}</Label>
                      </div>
                      {!exp.isCurrentPosition && (
                        <div className="flex-1">
                          <Label>{t('worker.profile.modals.workExperience.dates.end')}</Label>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <EnhancedDatePicker
                          date={exp.startDate}
                          onSelect={(date) => date && handleUpdateField(index, 'startDate', date)}
                          disabled={(date) =>
                            date > new Date() || (exp.endDate && date > exp.endDate)
                          }
                          label={t('worker.profile.modals.workExperience.dates.selectStart')}
                        />
                      </div>
                      {!exp.isCurrentPosition && (
                        <div className="flex-1">
                          <EnhancedDatePicker
                            date={exp.endDate}
                            onSelect={(date) => date && handleUpdateField(index, 'endDate', date)}
                            disabled={(date) =>
                              date > new Date() || date < exp.startDate
                            }
                            label={t('worker.profile.modals.workExperience.dates.selectEnd')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                className="rounded-full fixed bottom-24 right-8 bg-accent hover:bg-accent/90 border-0 z-50"
                onClick={handleAddExperience}
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>

          <div className="border-t p-4 sm:px-6 bg-background flex-shrink-0">
            <div className="flex justify-start">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? t('common.button.saving') : t('common.button.saveChanges')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('worker.profile.modals.workExperience.unsavedChanges.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('worker.profile.modals.workExperience.unsavedChanges.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('worker.profile.modals.workExperience.unsavedChanges.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                setHasUnsavedChanges(false);
                onClose();
              }}
            >
              {t('worker.profile.modals.workExperience.unsavedChanges.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorkExperienceListModal;
