import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fr from "./translations/fr.json";
import ru from "./translations/ru.json";
import zh from "./translations/zh.json";
import zu from "./translations/zu.json";

const isInContextTranslation = true; // process.env.REACT_APP_IN_CONTEXT_TRANSLATION;

const psuedoLanguage = {
  keys: zu,
  locale: "zu",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: { translations: en },
      fr: { translations: fr },
      ru: { translations: ru },
      zh: { translations: zh },
      ...(isInContextTranslation ? { zu: { translations: zu } } : {}),
    },
    lng: isInContextTranslation ? psuedoLanguage.locale : undefined,
    fallbackLng: "en",
    debug: true,
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
