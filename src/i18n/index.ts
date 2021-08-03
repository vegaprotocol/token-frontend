import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import english from "./en";

const en = {
  translations: english,
};

const foo = {
  translations: Object.keys(en.translations).reduce(
    (acc: Record<string, string>, key: string) => {
      acc[key] = "foo";
      return acc;
    },
    {}
  ),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en,
      foo,
    },
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
