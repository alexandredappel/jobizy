import { JobType, Language } from '../../types/firebase.types';

type TranslationRecord = Record<string, string>;
type LanguageTranslations = Record<'en' | 'id', TranslationRecord>;

export const JOB_TYPES_TRANSLATIONS: LanguageTranslations = {
  en: {
    'WAITER': 'Waiter',
    'COOK': 'Cook',
    'CASHIER': 'Cashier',
    'MANAGER': 'Manager',
    'HOUSEKEEPER': 'Housekeeper',
    'GARDENER': 'Gardener',
    'POOL_GUY': 'Pool Guy',
    'BARTENDER': 'Bartender',
    'SELLER': 'Seller'
  },
  id: {
    'WAITER': 'Pelayan',
    'COOK': 'Koki',
    'CASHIER': 'Kasir',
    'MANAGER': 'Manajer',
    'HOUSEKEEPER': 'Pembantu Rumah Tangga',
    'GARDENER': 'Tukang Kebun',
    'POOL_GUY': 'Petugas Kolam',
    'BARTENDER': 'Bartender',
    'SELLER': 'Penjual'
  }
};

export const LANGUAGES_TRANSLATIONS: LanguageTranslations = {
  en: {
    'ENGLISH': 'English',
    'BAHASA': 'Indonesian'
  },
  id: {
    'ENGLISH': 'Bahasa Inggris',
    'BAHASA': 'Bahasa Indonesia'
  }
};
