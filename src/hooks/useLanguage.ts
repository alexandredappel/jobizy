import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserLanguage } from '@/lib/i18n';
import { useToast } from './use-toast';

export function useLanguage(userId: string) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const { toast } = useToast();

  useEffect(() => {
    const loadUserLanguage = async () => {
      const lang = await getUserLanguage(userId);
      setCurrentLanguage(lang);
      await i18n.changeLanguage(lang);
    };

    if (userId) {
      loadUserLanguage();
    }
  }, [userId, i18n]);

  const changeLanguage = async (language: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        preferred_language: language,
        updated_at: new Date()
      });
      
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      
      toast({
        title: i18n.t('settings.profile_updated'),
        description: i18n.t('settings.language_updated'),
      });
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: i18n.t('settings.error_updating'),
        description: String(error),
        variant: "destructive",
      });
    }
  };

  return { currentLanguage, changeLanguage };
}