import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/src/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common'],
    defaultNS: 'common',
  });

// Utility function to get user's preferred language
export const getUserLanguage = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().preferred_language || 'en';
    }
    return 'en';
  } catch (error) {
    console.error('Error fetching user language:', error);
    return 'en';
  }
};

// Utility functions for data conversion
export const getStorageValue = (key: string, value: string): string => {
  // Convert UI value to storage value (always English)
  const storageMap = {
    jobs: {
      'Pramusaji': 'Waiter',
      'Koki': 'Cook',
      // ... add other mappings
    },
    // ... add other categories
  };

  return storageMap[key]?.[value] || value;
};

export const getDisplayValue = (key: string, value: string): string => {
  // Use i18next translation
  return i18n.t(`${key}.${value.toLowerCase()}`, { defaultValue: value });
};

export default i18n;