import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    console.log('Changing language to:', newLang);
    i18n.changeLanguage(newLang);
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