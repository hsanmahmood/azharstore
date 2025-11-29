import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from './DataContext';

const useLanguageInitializer = () => {
  const { i18n } = useTranslation();
  const { translations, isLoading } = useContext(DataContext);

  useEffect(() => {
    if (!isLoading && translations.length > 0) {
      const resources = {
        ar: { translation: {} },
      };
      translations.forEach(t => {
        const keys = t.key.split('.');
        let currentLevel = resources.ar.translation;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            currentLevel[key] = t.value;
          } else {
            currentLevel[key] = currentLevel[key] || {};
            currentLevel = currentLevel[key];
          }
        });
      });
      i18n.addResourceBundle('ar', 'translation', resources.ar.translation, true, true);
      i18n.changeLanguage('ar');
    }
  }, [isLoading, translations, i18n]);
};

export default useLanguageInitializer;
