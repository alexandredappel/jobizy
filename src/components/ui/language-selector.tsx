
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GB, ID } from 'country-flag-icons/react/3x2';

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
      className="text-primary hover:text-primary/80 p-0"
    >
      {i18n.language === 'en' ? (
        <ID className="w-6 h-4" title="Switch to Indonesian" />
      ) : (
        <GB className="w-6 h-4" title="Switch to English" />
      )}
    </Button>
  );
};

export default LanguageSelector;
