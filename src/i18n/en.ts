const en = {
  Home: "Home",

  // Page titles
  pageTitleHome: "Vega Tokens",
  pageTitleClaim: "Claim Vega tokens",
  pageTitleAssociate: "Associate VEGA tokens with VEGA Key",
  pageTitleRedemption: "CHECK AND REDEEM",
  pageTitleTranches: "Vesting tranches",
  pageTitleStaking: "Stake your VEGA",
  pageTitle404: "Page not found",
  pageTitleNotPermitted: "Can not proceed!",
  pageTitleDisassociate: "Dissociate VEGA tokens from a Vega key",
  Vesting: "VESTING VEGA TOKENS",
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
  Unlocked: "Unlocked",
  Staked: "Staked",
  Total: "Total",
  Balance: "Balance",
  Cancel: "Cancel",
  Warning: "Warning",
  Associated: "Associated",

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
    "You'll be able to redeem your unlocked tokens at token.vega.xyz/vesting",
  codeUsed: "Code already used",
  codeUsedText:
    "Looks like that code has already been used for address {{address}}",
  codeExpired: "Code expired",

  invalidWeb3Browser: "You need a web3 capable browser to use this site",
  invalidWeb3Provider:
    "Incompatible web3 provider detected. Please try another browser / extension.",
  "Vesting Balance": "Vesting Balance",
  VEGA: "VEGA",
  Account: "Account",
  Loading: "Loading...",
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
  "none redeemable":
    "Tokens in this tranche unlock on {{unlockDate}} and continue to unlock gradually until {{trancheEndDate}} when all tokens are unlocked. Come back to token.vega.xyz to redeem your tokens once they begin to unlock.",
  "partially redeemable":
    "Tokens in this tranche began to unlock on {{unlockDate}} and will continue to unlock gradually until {{trancheEndDate}} when all tokens are unlocked.",
  "fully redeemable":
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

  // Validation
  required: "Required",

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
  "This tranche was used to perform integration testing only prior to token launch and no tokens will enter the supply before 3rd Sep 2021.":
    "This tranche was used to perform integration testing only prior to token launch and no tokens will enter the supply before 3rd Sep 2021.",
  "Showing tranches with <{{trancheMinimum}} VEGA, click to hide these tranches":
    "Showing tranches with <{{trancheMinimum}} VEGA, click to hide these tranches",
  "Not showing tranches with <{{trancheMinimum}} VEGA, click to show all tranches":
    "Not showing tranches with <={{trancheMinimum}} VEGA, click to show all tranches",
  "the holder": "the holder",
  "We couldn't seem to load your data.": "We couldn't seem to load your data.",
  "Vesting VEGA": "Vesting VEGA",
  "All the tokens in this tranche are locked and can not be redeemed yet.":
    "All the tokens in this tranche are locked and can not be redeemed yet.",
  "Redeem unlocked VEGA from tranche {{id}}":
    "Redeem unlocked VEGA from tranche {{id}}",
  "You must reduce your associated vesting tokens by at least {{amount}} to redeem from this tranche. <stakeLink>Manage your stake</stakeLink> or just <disassociateLink>dissociate your tokens</disassociateLink>.":
    "You must reduce your associated vesting tokens by at least {{amount}} to redeem from this tranche. <stakeLink>Manage your stake</stakeLink> or just <disassociateLink>dissociate your tokens</disassociateLink>.",
  redemptionExplain:
    "Note: The redeem function attempts to redeem all unlocked tokens from a tranche. However, it will only work if all the amount you are redeeming would not reduce the amount you have staked while vesting.",
  "Use this page to redeem any unlocked VEGA tokens.":
    "Use this page to redeem any unlocked VEGA tokens.",
  "{{stakedBalance}} are staked.": "{{stakedBalance}} are staked.",
  "A total of {{amount}} Locked Vega tokens.":
    "A total of {{amount}} Locked Vega tokens.",
  "A total of {{amount}} Unlocked Vega tokens.":
    "A total of {{amount}} Unlocked Vega tokens.",
  "{{address}} has {{balance}} VEGA tokens in {{tranches}} tranches of the vesting contract.":
    "The connected ethereum wallet ({{address}}) has {{balance}} VEGA tokens in {{tranches}} tranches of the vesting contract.",
  "Stake your Locked VEGA tokens!":
    "You can stake your VEGA tokens even while locked.",
  "Find out more about Staking.":
    "Use your Vega tokens to stake a validator, earn rewards and participate in governance of the Vega network.",
  "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed.":
    "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed.",

  // Ethereum wallet
  ethereumKey: "Ethereum key",
  checkingForProvider: "Checking for provider",
  "Awaiting action in wallet...":
    "Awaiting action in Ethereum wallet (e.g. metamask)",
  "Connect with Metamask": "Connect with Metamask",

  // Vega wallet
  viewKeys: "View keys",
  vegaKey: "Vega key",
  noService:
    "Looks like the Vega wallet service isn't running. Please start it and refresh the page",
  connectVegaWallet: "Connect to VEGA wallet",
  disconnect: "Disconnect",
  awaitingDisconnect: "Disconnecting...",
  "Checking Vega wallet status": "Checking Vega wallet status",
  urlLabel: "Wallet location",
  walletLabel: "Wallet",
  passphraseLabel: "Passphrase",
  vegaWalletConnect: "Connect",
  vegaWalletConnecting: "Connecting...",
  "No token": "No token",
  "Wallet service unavailable": "Wallet service not running",
  "Session expired": "Session expired",
  "Invalid credentials": "Wallet or passphrase incorrect",
  noKeys: "No keys",
  "Stake VEGA tokens": "Stake VEGA tokens",
  "Tranche breakdown": "Tranche breakdown",
  "Across all tranches": "Across all tranches",

  // Homepage
  "The Vega Token": "The Vega Token",
  // Duplicate title -> should probably use sections, lazily de-duping by changing the key
  "Token Vesting": "Vesting",
  Governance: "Governance",
  Staking: "Staking",
  "Once tokens have unlocked they can be redeemed to the Ethereum wallet that owns them":
    "Once tokens have unlocked they can be redeemed to the Ethereum wallet that owns them.",
  "Tokens are held in different Tranches. Each tranche has its own schedule for how long the tokens are locked":
    "Tokens are held in different Tranches. Each tranche has its own schedule for how long the tokens are locked.",
  "Most VEGA tokens are held in a vesting contract. This means that they cannot be transferred between wallets until their vesting term is complete":
    "Most VEGA tokens are held in a vesting contract. This means that they cannot be transferred between wallets until their vesting term is complete.",
  "Token holders can propose changes to the Vega network":
    "Token holders can propose changes to the Vega network.",
  "Token holders can nominate their tokens to a validator and are rewarded a proportion of the fees accumulated for infrastructure":
    "Token holders can nominate their tokens to a validator and are rewarded a proportion of the fees accumulated for infrastructure.",

  // Token Details
  "Token address": "Token address",
  "Token contract": "Token contract",
  "Total supply": "Total supply",
  "Circulating supply": "Circulating supply",
  "Staked on Vega": "Staked on Vega",
  "Associated on Vega": "Associated on Vega",
  "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens":
    "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens",
  "Read about staking on Vega": "Read about staking on Vega",
  "Read about Governance on Vega": "Read about Governance on Vega",

  // Epoch counter
  Epoch: "Epoch",
  Started: "Started",
  "Ends in": "Ends in",
  // Node Validator
  "Manage your stake": "Manage your stake",
  "Add Stake": "Add Stake",
  "Remove Stake": "Remove Stake",
  "Your Stake": "Your Stake",
  "Your Stake On Node (This Epoch)": "Your Stake On Node (This Epoch)",
  "Your Stake On Node (Next Epoch)": "Your Stake On Node (Next Epoch)",
  "VALIDATOR {{node}}": "VALIDATOR: {{node}}",
  "VEGA ADDRESS / PUBLIC KEY": "VEGA ADDRESS / PUBLIC KEY",
  "ABOUT THIS VALIDATOR": "ABOUT THIS VALIDATOR",
  "IP ADDRESS": "IP ADDRESS",
  "TOTAL STAKE": "TOTAL STAKE",
  "STAKE SHARE": "STAKE SHARE",
  "OWN STAKE (THIS EPOCH)": "OWN STAKE (THIS EPOCH)",
  "NOMINATED (THIS EPOCH)": "NOMINATED (THIS EPOCH)",
  "Use maximum": "Use maximum",
  "How much would you like to associate?":
    "How much would you like to associate?",
  "VEGA Tokens": "VEGA Tokens",
  "Connected Vega key": "Connected Vega key",
  "What Vega wallet/key is going to control your stake?":
    "What Vega wallet/key is going to control your stake?",
  "Where would you like to stake from?": "Where would you like to stake from?",
  "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed.":
    "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed.",
  "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes.":
    "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes.",
  "Associate VEGA Tokens with key": "Associate VEGA Tokens with key",
  "Vesting contract": "Vesting contract",
  Wallet: "Wallet",
  "Nominate Stake to Validator Node": "Nominate Stake to Validator Node",
  "Associating Tokens": "Associating Tokens",
  Done: "Done",
  "Associating {{amount}} VEGA tokens with Vega key {{vegaKey}}":
    "Associating {{amount}} VEGA tokens with Vega key {{vegaKey}}",
  "The Vega network requires 30 Confirmations (approx 5 minutes) on Ethereum before crediting your Vega key with your tokens. This page will update once complete or you can come back and check your Vega wallet to see if it is ready to use.":
    "The Vega network requires 30 Confirmations (approx 5 minutes) on Ethereum before crediting your Vega key with your tokens. This page will update once complete or you can come back and check your Vega wallet to see if it is ready to use.",
  "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.":
    "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.",
  "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method.":
    "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method.",
  "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key":
    "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key",
  "VEGA tokens are approved for staking":
    "VEGA tokens are approved for staking",
  "Approve VEGA tokens for staking on Vega":
    "Approve VEGA tokens for staking on Vega",
  "You have no VEGA tokens currently vesting.":
    "You have no VEGA tokens currently vesting.",
  "All VEGA tokens vesting in the connected wallet have already been staked.":
    "All VEGA tokens vesting in the connected wallet have already been staked.",
  "Any Tokens that have been nominated to a node will sacrifice any Rewards they are due for the current epoch. If you do not wish to sacrifices fees you should remove stake from a node at the end of an epoch before disassocation.":
    "Any Tokens that have been nominated to a node will sacrifice any Rewards they are due for the current epoch. If you do not wish to sacrifices fees you should remove stake from a node at the end of an epoch before disassocation.",
  "Use this form to disassociate VEGA tokens with a Vega key. This returns them to either the Ethereum wallet that used the Staking bridge or the vesting contract.":
    "Use this form to disassociate VEGA tokens with a Vega key. This returns them to either the Ethereum wallet that used the Staking bridge or the vesting contract.",
  "What Vega wallet are you removing Tokens from?":
    "What Vega wallet are you removing Tokens from?",
  "What tokens would you like to return?":
    "What tokens would you like to return?",
  "You have no VEGA tokens currently staked through your connected Vega wallet.":
    "You have no VEGA tokens currently staked through your connected Vega wallet.",
  "You have no VEGA tokens currently staked through your connected Eth wallet.":
    "You have no VEGA tokens currently staked through your connected Eth wallet.",
  "Dissociating Tokens": "Dissociating Tokens",
  "Dissociating  {{amount}} VEGA tokens from Vega key {{vegaKey}}":
    "Dissociating  {{amount}} VEGA tokens from Vega key {{vegaKey}}",
  "Redeem tokens": "Redeem tokens",
  "{{amount}} VEGA tokens have been returned to Vesting contract":
    "{{amount}} VEGA tokens have been returned to Vesting contract",
  "{{amount}} VEGA tokens have been returned to Ethereum wallet":
    "{{amount}} VEGA tokens have been returned to Ethereum wallet",
  "Disassociate VEGA Tokens from key": "Disassociate VEGA Tokens from key",
  "Not staked": "Not staked",
  "In Wallet": "In Wallet",
  Connect: "Connect",
};

export default en;
