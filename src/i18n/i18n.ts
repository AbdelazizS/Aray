import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translationsEN from './en/en.json'
import translationsAR from './ar/ar.json'
import homeEnTranslations from './en/home.json'
import settingsEnTranslations from './en/settings.json'
import academiesEnTranslations from './en/academies.json'
import bookingsEnTranslations from './en/history.json'
import paymentsEnTranslations from './en/payments.json'
import formsEnTranslations from './en/forms.json'
import homeArTranslations from './ar/home.json'
import settingsArTranslations from './ar/settings.json'
import academiesArTranslations from './ar/academies.json'
import bookingsArTranslations from './ar/history.json'
import paymentsArTranslations from './ar/payments.json'
import formsArTranslations from './ar/forms.json'

const resources = {
  en: {
    main:translationsEN,
    Home:homeEnTranslations,
    Settings:settingsEnTranslations,
    forms:formsEnTranslations,
    academies:academiesEnTranslations,
    bookings:bookingsEnTranslations,
    payments:paymentsEnTranslations,
  },
  ar: {
    main:translationsAR,
    Home:homeArTranslations,
    Settings:settingsArTranslations,
    forms:formsArTranslations,
    academies:academiesArTranslations,
    bookings:bookingsArTranslations,
    payments:paymentsArTranslations,
  }
};

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en', // default language
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });
  
  export default i18next;