import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AboutMeModalProps {
  open: boolean;
  onClose: () => void;
  aboutMe: string;
  userId: string;
}

const AboutMeModal = ({
  open,
  onClose,
  aboutMe,
  userId,
}: AboutMeModalProps) => {
  const { t } = useTranslation();
  const [localAboutMe, setLocalAboutMe] = useState(aboutMe);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        about_me: localAboutMe
      });

      toast({
        title: t('worker.profile.edit.aboutMe.toast.success.title'),
        description: t('worker.profile.edit.aboutMe.toast.success.description')
      });
      onClose();
    } catch (error) {
      console.error('Error updating about me:', error);
      toast({
        title: t('worker.profile.edit.aboutMe.toast.error.title'),
        description: t('worker.profile.edit.aboutMe.toast.error.description'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-[95vw] md:w-[50vw] max-w-[95vw] max-h-[90vh] p-0 gap-0 sm:px-6">
        <DialogHeader className="px-4 sm:px-6 pt-6 mb-8 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            {t('worker.profile.edit.aboutMe.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-6">
          <Textarea
            value={localAboutMe}
            onChange={(e) => setLocalAboutMe(e.target.value)}
            placeholder={t('worker.profile.edit.aboutMe.placeholder')}
            className="min-h-[200px] resize-none"
            maxLength={300}
          />
          <p className="text-sm text-gray-500 mt-2">
            {t('worker.profile.edit.aboutMe.characterCount', {
              current: localAboutMe.length,
              max: 300
            })}
          </p>
        </div>

        <div className="border-t p-4 sm:px-6 bg-background flex-shrink-0">
          <div className="flex justify-start">
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? t('worker.profile.edit.buttons.saving') : t('worker.profile.edit.buttons.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutMeModal;