import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const en = {
  translations: {
    Home: "Home",

    // Page titles
    pageTitleClaim: "Claim tokens",
    pageTitleRedemption: "Redeem tokens",
    pageTitleTranches: "View tranches",
    pageTitle404: "Page not found",
    Vesting: "Vesting",
    Connect: "Connect to see your VEGA balance",
    of: "of",
    to: "to",

    Tranche: "Tranche",
    "Invalid tranche!": "Invalid tranche!",
    Redeemed: "Redeemed",
    Locked: "Locked",
    Back: "Back",
    Continue: "Continue",
    Withdraw: "Withdraw",

    "VEGA was successfully withdrawn to your wallet":
      "VEGA was successfully withdrawn to your wallet",

    "Please select your country": "Please select your country",

    "Fully vested on": "Fully vested on",
    "Vesting from": "Vesting from",

    "Something doesn't look right": "Something doesn't look right",
    "If you have been given a link please double check and try again":
      "If you have been given a link please double check and try again",

    "You will need to connect to an ethereum wallet to pay the gas and claim tokens":
      "To claim tokens you will need to connect an ethereum wallet with ETH to pay for gas. It may be easier to connect to the wallet that you wish your tokens to be sent to.",
    "Please check wallet": "Please check wallet",
    "Connect to an Ethereum wallet": "Connect to an Ethereum wallet",

    projectDescription:
      "This web page reads directly from the vesting smart contract implemented by the Vega project team. The vesting smart is responsible for holding tokens whilst they are locked, and managing the distribution of tokens to their owners according to pre-defined vesting terms.",
    "The contract is deployed at the following address":
      "The contract is deployed at the following address:",

    step1Title: "Step 1 - Commit your claim.",
    step1Body:
      "This posts your claim to the Ethereum chain in an way where it can not be used by another address",

    step2Title: "Step 2 - Reveal your claim.",
    step2Body:
      "You’ll need to wait at least one block after step 1 before making step 2. This sends a message to the chain that reveals your claim.",
    step2Note: "You must complete step 1 first.",

    claim1:
      "This code ({{code}}) entitles <bold>{{user}}</bold> to <bold>20 Vega</bold> tokens from ",
    claim2: "of the vesting contract. It expires on {{expiry}}.",
    showRedeem:
      "You'll be able to redeem your unlocked tokens at token.vega.xyz/redemption",

    invalidWeb3Browser: "Please a compatible browser or install Metamask",
    "Vesting Balance": "Vesting Balance",
    VEGA: "VEGA",
    Account: "Account",
    Loading: "Loading",
    "Awaiting action in wallet...": "Awaiting action in wallet...",
    "Something went wrong": "Something went wrong",
    "Try again": "Try again",
    Warning: "Warning",
    "You can use your connected key to claim the Tokens but it will credit {{target}} instead of {{address}}":
      "You are connected to a different wallet to the one this claim is valid for. You can continue with the connected wallet but <bold>{{target}}</bold> will be credited.",
    Complete: "Complete",
    "View on Etherscan (opens in a new tab)":
      "View on Etherscan (opens in a new tab)",
    "Transaction in progress": "Transaction in progress",
    "Unknown error": "Unknown error",
    "Awaiting action in Ethereum wallet (e.g. metamask)":
      "Awaiting action in Ethereum wallet (e.g. metamask)",
    "Claim {amount} Vega": "Claim {{amount}} Vega",
    "Sorry. It is not possible to claim tokens in your country or region.":
      "Sorry. It is not possible to claim tokens in your country or region.",
    "Connected to Ethereum key {address}":
      "Connected to Ethereum key <bold>{{address}}</bold>. You can change your connected key in your wallet provider e.g. Meta Mask.",
    "tranche description":
      "Tokens in this tranche began to unlock on the {{unlockDate}} and continue to unlock, block by block, until {{trancheEndDate}} when all tokens are unlocked.",
    "none redeemable":
      "You’ll be able to redeem tokens once they have been claimed and vested.",
    "partially redeemable":
      "You’ll be able to redeem some tokens once they have been claimed.",
    "fully redeemable":
      "Tokens in this tranche are fully unlocked. You can redeem tokens once they have been claimed.",
    "Tokens in this tranche are fully unlocked":
      "Tokens in this tranche are fully unlocked",
    "This page can not be found, please check the URL and try again.":
      "This page can not be found, please check the URL and try again.",
    "Service unavailable": "Service unavailable",
    "This service is not available in your country": "This service is not available in your country"
  },
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
