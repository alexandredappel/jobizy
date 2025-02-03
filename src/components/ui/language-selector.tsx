import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  
  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
    
    // Store language preference in Firebase if user is logged in
    if (user?.id) {
      try {
        console.log('Updating language preference to:', newLang);
        await updateDoc(doc(db, 'users', user.id), {
          preferred_language: newLang
        });
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };

  return (
    <Button
      variant="link"
      size="sm"
      onClick={toggleLanguage}
      className="text-primary hover:text-primary/80"
    >
      {i18n.language === 'en' ? 'ID' : 'EN'}
    </Button>
  );
};

export default LanguageSelector;