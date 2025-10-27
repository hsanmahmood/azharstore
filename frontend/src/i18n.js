import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    supportedLngs: ['en'],
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'admin'],
    defaultNS: 'common',
  });

export default i18n;
