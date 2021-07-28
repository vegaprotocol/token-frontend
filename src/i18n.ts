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
          "Continue": "Continue",

          "Please select your country": "Please select your country",
          "I accept the Terms and Conditions": "I accept the Terms and Conditions",

          "Fully vested on": "Fully vested on",
          "Vesting from": "Vesting from",

          "Something doesn't look right": "Something doesn't look right",
          "If you have been given a link please double check and try again": "If you have been given a link please double check and try again",
          
          projectDescription: "This web page reads directly from the vesting smart contract implemented by the Vega project team. The vesting smart is responsible for holding tokens whilst they are locked, and managing the distribution of tokens to their owners according to pre-defined vesting terms.",
          "The contract is deployed at the following address": "The contract is deployed at the following address:",

          step1Title: "Step 1 - Commit your claim.",
          step1Body: "This posts your claim to the Ethereum chain in an way where it can not be used by another address",

          step2Title: "Step 2 - Reveal your claim.",
          step2Body: "You’ll need to wait at least one block after step 1 before making step 2. This sends a message to the chain that reveals your claim.",
          step2Note: "You must complete step 1 first."
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
