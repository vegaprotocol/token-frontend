import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "Vesting": "Vesting",
          "Connect": "Connect",
          "of": "of",
          "Tranche": "Tranche",
          "Invalid tranche!": "Invalid tranche!",
          "Redeemed": "Redeemed",
          "Locked": "Locked",
          "Back": "Back",
          "Fully vested on": "Fully vested on",
          "Vesting from": "Vesting from",
          projectDescription: "This web page reads directly from the vesting smart contract implemented by the Vega project team. The vesting smart is responsible for holding tokens whilst they are locked, and managing the distribution of tokens to their owners according to pre-defined vesting terms.",
          "The contract is deployed at the following address": "The contract is deployed at the following address:",
        }
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
