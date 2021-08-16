import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const en = {
  translations: {
    Home: "Home",

    // Page titles
    pageTitleClaim: "Claim Vega tokens",
    pageTitleRedemption: "Redeem tokens",
    pageTitleTranches: "Vesting tranches",
    pageTitle404: "Page not found",
    pageTitleNotPermitted: "Can not proceed!",
    Vesting: "VESTING VEGA TOKENS",
    Connect: "Connect to see your VEGA balance",
    of: "of",
    to: "to",

    Tranche: "Tranche",
    Tranches: "Tranches",
    "Invalid tranche!": "Invalid tranche!",
    Redeemed: "Redeemed",
    Locked: "Locked",
    Back: "Back",
    Continue: "Continue",
    Withdraw: "Withdraw",
    Step: "Step",

    "VEGA was successfully withdrawn to your wallet":
      "VEGA was successfully withdrawn to your wallet",

    "Please select your country": "Please select your country",

    "Fully vested on": "Fully vested on {{date}}",
    "Vesting from": "Vesting from {{fromDate}} to {{endDate}}",

    "Something doesn't look right": "Something doesn't look right",
    "If you have been given a link please double check and try again":
      "If you have been given a link please double check and try again",

    "You will need to connect to an ethereum wallet to pay the gas and claim tokens":
      "To claim tokens you will need to connect an ethereum wallet with ETH to pay for gas. It may be easier to connect to the wallet that you wish your tokens to be sent to.",
    "Please check wallet": "Please check wallet",
    "Connect to an Ethereum wallet": "Connect to an Ethereum wallet",

    projectDescription:
      "This web page reads directly from the vesting smart contract implemented by the Vega project team. The vesting smart contract is responsible for holding tokens whilst they are locked, and managing the distribution of tokens to their owners according to pre-defined vesting terms.",
    "The contract is deployed at the following address":
      "The contract is deployed at the following address:",

    "Connected Ethereum address": "Connected Ethereum address",
    "Amount of VEGA": "Amount of VEGA",
    "Claim expires": "Claim expires",
    "Starts unlocking": "Unlocking starts",
    "Fully unlocked": "Fully unlocked",

    "Select country": "Select country/region of residence",
    "You cannot claim VEGA tokens if you reside in that country":
      "It is not possible to claim VEGA tokens if you reside in that country or region",

    commitTitle: "Link claim to your Ethereum address",
    commitBody:
      "This links your claim to a specific ethereum address to prevent it being used by another person",
    selectCountryPrompt: "You must select a country/region first.",
    verifyingCountryPrompt: "Verifying country/region...",

    "Claim tokens": "Claim tokens",
    claimNotReady: "You must complete step 2 first.",

    claim:
      "This code ({{code}}) entitles <bold>{{user}}</bold> to <bold>{{amount}} VEGA</bold> tokens from <trancheLink>{{linkText}}</trancheLink> of the vesting contract. {{expiry}}.",
    claimExpiry: "The code expires on {{date}}",
    claimNoExpiry: "It has no expiry date",
    showRedeem:
      "You'll be able to redeem your unlocked tokens at token.vega.xyz/redemption",
    codeUsed: "Code already used",
    codeUsedText:
      "Looks like that code has already been used for address {{address}}",
    codeExpired: "Code expired",

    invalidWeb3Browser: "You need a web3 capable browser to use this site",
    "Vesting Balance": "Vesting Balance",
    VEGA: "VEGA",
    Account: "Account",
    Loading: "Loading...",
    "Awaiting action in wallet...":
      "Awaiting action in Ethereum wallet (e.g. metamask)",
    "Something went wrong": "Something went wrong",
    "Try again": "Try again",
    Complete: "Complete",
    "View on Etherscan (opens in a new tab)":
      "View on Etherscan (opens in a new tab)",
    "Transaction in progress": "Transaction in progress",
    "Unknown error": "Unknown error",
    "Awaiting action in Ethereum wallet (e.g. metamask)":
      "Awaiting action in Ethereum wallet (e.g. metamask)",
    "Claim {amount} Vega": "Claim {{amount}} VEGA",
    "Sorry. It is not possible to claim tokens in your country or region.":
      "It is not possible to claim tokens in your country or region.",
    "tranche description":
      "Tokens in this tranche unlock on {{unlockDate}} and continue to unlock gradually until {{trancheEndDate}} when all tokens are unlocked. Come back to token.vega.xyz to redeem your tokens once they begin to unlock.",
    "none redeemable":
      "Tokens in this tranche unlock on {{unlockDate}} and continue to unlock gradually until {{trancheEndDate}} when all tokens are unlocked. Come back to token.vega.xyz to redeem your tokens once they begin to unlock.",
    "partially redeemable":
      "Tokens in this tranche began to unlock on {{unlockDate}} and will continue to unlock gradually until {{trancheEndDate}} when all tokens are unlocked. A redeem function will exist at token.vega.xyz in the near future",
    "fully redeemable":
      "Tokens in this tranche have fully unlocked and can be redeemed once claimed. A redeem function will exist at token.vega.xyz in the near future",
    "Tokens in this tranche are fully unlocked.":
      "Tokens in this tranche have fully unlocked and can be redeemed once claimed.",
    "This page can not be found, please check the URL and try again.":
      "This page can not be found, please check the URL and try again.",
    "Service unavailable": "Service unavailable",
    "This service is not available in your country":
      "This service is not available in your country/region",
    "Wrong network": "Looks like you are on {{chain}}",
    "Desired network": "This app is only configured for {{chain}}",
    "This code ({code}) has expired and cannot be used to claim tokens":
      "This code ({{code}}) has expired and cannot be used to claim tokens.",
    "Looks like that code has already been used.":
      "Looks like that code has already been used.",

    "Add the Vega vesting token to your wallet to track how much you Vega you have in the vesting contract.":
      "Add the Vega vesting token to your wallet to track how much you Vega you have in the vesting contract.",

    connectedAddress: "Connected to Ethereum key {{address}}.",
    addressMismatch:
      "<red>Error:</red> The address you are connected to is <bold>not</bold> the address the claim is valid for. To claim these tokens please connect with <bold>{{target}}</bold>.",
    "Select your country or region of current residence":
      "Select your country or region of current residence",
    "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas.":
      "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas.",
    "Tranche not found": "Tranche not found",
    "You must select a valid country": "You must select a valid country/region",
    "Verifying your claim": "Verifying your claim",
    Users: "Users",
    "No users": "No users",

    // Claim success callout
    claimComplete: "Claim complete",
    claimCompleteMessage:
      "Ethereum address {{address}} now has a vested right to {{balance}} VEGA tokens from <trancheLink>{{trancheLinkText}}</trancheLink> of the vesting contract.",
    "Link transaction": "Link transaction",
    "Claim transaction": "Claim transaction",
    "Keep track of locked tokens in your wallet with the VEGA (VESTING) token.":
      "Keep track of locked tokens in your wallet with the VEGA (LOCKED) token.",
    "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.":
      "Add the VEGA (LOCKED) token to your wallet to track how much VEGA you have in the vesting contract. The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
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
