import { useTranslation } from 'react-i18next';
import { JOB_TYPES_TRANSLATIONS, LANGUAGES_TRANSLATIONS } from '../i18n/constants';
import type { JobType, Language } from '../types/firebase.types';

export const useTranslatedConstants = () => {
  const { i18n } = useTranslation();
  
  // Nous utilisons une assertion de type ici car nous savons que la langue sera toujours 'en' ou 'id'
  const currentLang = i18n.language as 'en' | 'id';

  /**
   * Traduit un type de job dans la langue actuelle
   * @param job - Le type de job à traduire
   * @returns La traduction du job ou la clé originale si pas de traduction
   */
  const translateJob = (job: JobType): string => {
    return JOB_TYPES_TRANSLATIONS[currentLang][job] || job;
  };

  /**
   * Traduit une langue dans la langue actuelle
   * @param language - La langue à traduire
   * @returns La traduction de la langue ou la clé originale si pas de traduction
   */
  const translateLanguage = (language: Language): string => {
    return LANGUAGES_TRANSLATIONS[currentLang][language] || language;
  };

  /**
   * Traduit une liste de jobs dans la langue actuelle
   * @param jobs - La liste des jobs à traduire
   * @returns Un tableau de jobs traduits
   */
  const translateJobs = (jobs: JobType[]): string[] => {
    return jobs.map(translateJob);
  };

  /**
   * Traduit une liste de langues dans la langue actuelle
   * @param languages - La liste des langues à traduire
   * @returns Un tableau de langues traduites
   */
  const translateLanguages = (languages: Language[]): string[] => {
    return languages.map(translateLanguage);
  };

  return {
    translateJob,
    translateJobs,
    translateLanguage,
    translateLanguages,
  };
};
