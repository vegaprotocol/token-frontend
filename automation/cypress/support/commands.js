// TODO how do we do this?
const en = {
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

  claim:
    "This code ({{code}}) entitles <bold>{{user}}</bold> to <bold>{{amount}} Vega</bold> tokens from <trancheLink>{{linkText}}</trancheLink> of the vesting contract. {{expiry}}.",
  claimExpiry: "It expires on {{date}}",
  claimNoExpiry: "It has no expiry date",
  showRedeem:
    "You'll be able to redeem your unlocked tokens at token.vega.xyz/redemption",

  invalidWeb3Browser: "Please a compatible browser or install Metamask",
  "Vesting Balance": "Vesting Balance",
  VEGA: "VEGA",
  Account: "Account",
  Loading: "Loading...",
  "Awaiting action in wallet...": "Awaiting action in wallet...",
  "Something went wrong": "Something went wrong",
  "Try again": "Try again",
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
  "This service is not available in your country":
    "This service is not available in your country",
  "Wrong network": "Looks like you are on {{chain}}",
  "Desired network": "This app is only configured for  {{chain}}",
  "This code ({code}) has expired and cannot be used to claim tokens":
    "This code ({{code}}) has expired and cannot be used to claim tokens.",
  "Looks like that code has already been used.":
    "Looks like that code has already been used.",
  "Keep track of locked tokens in your wallet with the VEGA (VESTING) token.":
    "Keep track of locked tokens in your wallet with the VEGA (VESTING) token.",
  "Add the Vega vesting token to your wallet to track how much you Vega you have in the vesting contract.":
    "Add the Vega vesting token to your wallet to track how much you Vega you have in the vesting contract.",
  "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.":
    "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",

  // Address mismatch
  connectedAddress: "Connected to Ethereum key {{address}}.",
  addressMismatch:
    "<red>Error:</red> The address you are connected to is <bold>not</bold> the address the claim is valid for. To claim these tokens please connect with <bold>{{target}}</bold>.",
  "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas.":
    "Use the Ethereum wallet you want to send your tokens to. You'll also need enough Ethereum to pay gas.",
};

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//

Cypress.Commands.overwrite("contains", (originalFn, selector, str, ...rest) => {
  if (!en[str]) {
    throw Error("Could not find translations for string:", str);
  }
  return originalFn(selector, en[str], ...rest);
});
