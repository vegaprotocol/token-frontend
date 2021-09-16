const en = {
  Home: "Home",

  // Page titles
  pageTitleHome: "Vega Tokens",
  pageTitleClaim: "Claim Vega tokens",
  pageTitleAssociate: "Associate VEGA tokens with VEGA Key",
  pageTitleRedemption: "Vesting",
  pageTitleLiquidity: "Incentivised Liquidity Programme",
  pageTitleRedemptionTranche: "Redeem from Tranche",
  pageTitleTranches: "Vesting tranches",
  pageTitleStaking: "Staking",
  pageTitle404: "Page not found",
  pageTitleNotPermitted: "Can not proceed!",
  pageTitleDisassociate: "Dissociate VEGA tokens from a Vega key",
  pageTitleGovernance: "Governance",
  pageTitleDepositLp: "Deposit liquidity token for VEGA rewards",
  pageTitleWithdrawLp: "Withdraw SLP and Rewards",
  Vesting: "Vesting",
  of: "of",
  to: "to",
  Deposit: "deposit",
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
  vegaTokens: "VEGA tokens",
  "Connect with Metamask": "Connect with Metamask",

  "VEGA was successfully withdrawn to your wallet":
    "VEGA was successfully withdrawn to your wallet",

  "Please select your country": "Please select your country",

  "Fully vested on": "Fully vested on {{date}}",
  "Vesting from": "Vesting from {{fromDate}} to {{endDate}}",

  "Something doesn't look right": "Something doesn't look right",
  "If you have been given a link please double check and try again":
    "If you have been given a link please double check and try again",

  "You will need to connect to an ethereum wallet to pay the gas and claim tokens":
    "To claim tokens you will need to connect an Ethereum wallet with ETH to pay for gas. It may be easier to connect to the wallet that you wish your tokens to be sent to.",
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
    "This links your claim to a specific Ethereum address to prevent it being used by another person",
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
  codeUsedText: "Looks like that code has already been used",
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
    "Awaiting action in Ethereum wallet (e.g. Metamask)",
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
  wrongNetwork: "Looks like you are on {{chain}}.",
  wrongNetworkUnknownChain: "Looks like you are on not on {{chain}}.",
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
    "Ethereum address {{address}} now has a vested right to {{balance}} more VEGA tokens.",
  "Link transaction": "Link transaction",
  "Claim transaction": "Claim transaction",
  "This tranche was used to perform integration testing only prior to token launch and no tokens will enter the supply before 3rd Sep 2021.":
    "This tranche was used to perform integration testing only prior to token launch and no tokens will enter the supply before 3rd Sep 2021.",
  "Showing tranches with <{{trancheMinimum}} VEGA, click to hide these tranches":
    "Showing tranches with ≤{{trancheMinimum}} VEGA, click to hide these tranches",
  "Not showing tranches with <{{trancheMinimum}} VEGA, click to show all tranches":
    "Not showing tranches with ≤{{trancheMinimum}} VEGA, click to show all tranches",
  "the holder": "the holder",
  "We couldn't seem to load your data.": "We couldn't seem to load your data.",
  "Vesting VEGA": "Vesting VEGA",
  "All the tokens in this tranche are locked and can not be redeemed yet.":
    "All the tokens in this tranche are locked and can not be redeemed yet.",
  "Redeem unlocked VEGA from tranche {{id}}":
    "Redeem unlocked VEGA from tranche {{id}}",
  "You must reduce your associated vesting tokens by at least {{amount}} to redeem from this tranche. <stakeLink>Manage your stake</stakeLink> or just <disassociateLink>dissociate your tokens</disassociateLink>.":
    "You must reduce your associated vesting tokens by at least {{amount}} to redeem from this tranche. <stakeLink>Manage your stake</stakeLink> or just <disassociateLink>dissociate your tokens</disassociateLink>.",
  "All the tokens in this tranche are locked and must be assigned to a tranche before they can be redeemed.":
    "All the tokens in this tranche are locked and must be assigned to a tranche before they can be redeemed.",

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
    "The connected Ethereum wallet ({{address}}) has {{balance}} VEGA tokens in {{tranches}} tranche(s) of the vesting contract.",
  "Stake your Locked VEGA tokens!":
    "You can stake your VEGA tokens even while locked.",
  "Find out more about Staking.":
    "Use your Vega tokens to stake a validator, earn rewards and participate in governance of the Vega network.",
  noVestingTokens:
    "You do not have any vesting VEGA tokens. Switch to another Ethereum address to check what can be redeemed, or view <tranchesLink>all tranches</tranchesLink>",

  // Ethereum wallet
  ethereumKey: "Ethereum key",
  checkingForProvider: "Checking for provider",
  "Awaiting action in wallet...":
    "Awaiting action in Ethereum wallet (e.g. metamask)",
  Connect: "Connect to see your VEGA balance",
  "In wallet": "In wallet",
  "Not staked": "Not staked",

  // Vega wallet
  viewKeys: "View keys",
  vegaKey: "Vega key",
  noService:
    "Looks like the Vega wallet service isn't running. Please start it and refresh the page",
  connectVegaWallet: "Connect to Vega Wallet to control associated stake",
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
  "The $VEGA token": "The $VEGA token",
  // Duplicate title -> should probably use sections, lazily de-duping by changing the key
  "Token Vesting": "Vesting",
  Governance: "Governance",
  Staking: "Staking",
  "The vesting contract holds VEGA tokens until they have become unlocked.":
    "The vesting contract holds VEGA tokens until they have become unlocked.",
  "Once unlocked they can be redeemed from the contract so that you can transfer them between wallets.":
    "Once unlocked they can be redeemed from the contract so that you can transfer them between wallets.",
  "Tokens are held in different <trancheLink>Tranches</trancheLink>. Each tranche has its own schedule for how the tokens are unlocked.":
    "Tokens are held in different <trancheLink>Tranches</trancheLink>. Each tranche has its own schedule for how the tokens are unlocked.",

  // Governance
  proposedChangesToVegaNetwork:
    "This page lists proposed changes to the Vega network.",
  vegaTokenHoldersCanVote:
    "VEGA token holders can vote for or against proposals as well as make their own.",
  requiredMajorityDescription:
    "Each proposal needs both a required majority of votes (e.g 66% but this differs by proposal type) and to meet a minimum threshold of votes.",
  proposals: "Proposals",
  proposedEnactment: "Proposed enactment",
  voteStatus: "Vote status",
  shouldPass: "Should pass",
  participationNotMet: "Participation Not Met",
  majorityNotMet: "Majority not Met",
  failed: "Failed",
  passed: "Passed",
  noProposals: "There are no active network change proposals",

  // Token Details
  "Token address": "Token address",
  "Vesting contract": "Vesting contract",
  "Total supply": "Total supply",
  "Circulating supply": "Circulating supply",
  "Staked on Vega validator": "Staked on Vega validator",
  "$VEGA associated with a Vega key": "$VEGA associated with a Vega key",
  "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens":
    "There are {{nodeCount}} nodes with a shared stake of {{sharedStake}} VEGA tokens",

  // Epoch counter
  Epoch: "Epoch",
  Started: "Started",

  // Staking
  "Node invalid": "Node invalid",
  "Ends in {{endText}}": "Ends in {{endText}}",
  "Ended on {{endText}}": "Ended on {{endText}}",
  // Node Validator
  "Manage your stake": "Manage your stake",
  "Add Stake": "Add Stake",
  "Remove Stake": "Remove Stake",
  "Total stake": "Total stake",
  "Your stake": "Your stake",
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
  "All VEGA tokens vesting in the connected wallet have already been associated.":
    "All VEGA tokens vesting in the connected wallet have already been associated.",
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
  "Read about Vesting on Vega": "Read about Vesting on Vega",
  "Governance is coming soon": "Governance is coming soon",
  "Staking is coming soon": "Staking is coming soon",
  "VESTING VEGA TOKENS": "VESTING VEGA TOKENS",

  stakingStep1: "Step 1. Connect to a Vega wallet",
  stakingStep1Text:
    "You will need a <vegaWalletLink>Vega wallet</vegaWalletLink> to control stake and receive staking rewards.",
  stakingVegaWalletConnected:
    "Connected to Vega wallet with public key {{key}}",
  stakingStep2: "Step 2. Associate tokens with a Vega wallet",
  stakingStep2Text:
    "Your tokens need to be associated with a Vega wallet so that it can control your stake",
  stakingHasAssociated:
    "You have associated {{tokens}} to your connected Vega wallet. You can <associateLink>associate more</associateLink> or <disassociateLink>disassociate</disassociateLink>",

  stakingStep3: "Step3. Select the validator you'd like to nominate",

  associateButton: "Associate VEGA tokens with wallet",
  nodeQueryFailed: "Could not get data for node {{node}}",

  // stake pending
  "Adding {{amount}} VEGA to node {{node}}":
    "Adding {{amount}} VEGA to node {{node}}",
  "Removing {{amount}} VEGA from node {{node}}":
    "Removing {{amount}} VEGA from node {{node}}",
  "This should take approximately 3 minutes to confirm, and then will be credited at the beginning of the next epoch":
    "This should take approximately 3 minutes to confirm, and then will be credited at the beginning of the next epoch",

  // stake success
  "{{amount}} VEGA has been added to node {{node}}":
    "{{amount}} VEGA has been added to node {{node}}",
  "{{amount}} VEGA has been removed from {{node}}":
    "{{amount}} VEGA Has been removed from {{node}}",
  "It will be applied in the next epoch":
    "It will be applied in the next epoch",

  // stake fail
  stakeFailed: "Failed to delegate to node {{node}}",

  "Remove {{amount}} VEGA tokens": "Remove {{amount}} VEGA tokens",
  "How much to {{action}} in next epoch?":
    "How much to {{action}} in next epoch?",

  // LP tokens
  lpTokensInvalidToken:
    "Address {{address}} is not a valid LP token address for VEGA",
  depositLpTokensDescription:
    "Deposit the Tokens you received for providing liquidity and earn rewards in VEGA.",
  depositLpTokensHeading: "How much would you like to deposit?",
  depositLpSubmitButton: "Deposit {{address}}",
  depositLpApproveButton: "Approve deposits of {{address}}",
  depositLpInsufficientBalance: "You do not have tokens to deposit.",
  depositLpAlreadyStaked:
    "You have already staked your LP tokens, go to <withdrawLink>withdraw</withdrawLink> in order withdraw these before you can add more.",

  withdrawLpWithdrawButton: "Withdraw all SLP and VEGA rewards",
  withdrawLpNoneDeposited: "You have no SLP tokens deposited",

  "Dissociate VEGA tokens": "Dissociate VEGA tokens",
  "Early Investors": "Early Investors",
  Team: "Team",
  Community: "Community",
  "Public Sale": "Public Sale",
  "Connect to Vega wallet": "Connect to Vega wallet",
  "Check to see if you can redeem unlocked VEGA tokens":
    "Check to see if you can redeem unlocked VEGA tokens",
  "To use your tokens on the Vega network they need to be associated with a Vega wallet/key.":
    "To use your tokens on the Vega network they need to be associated with a Vega wallet/key.",
  "This can happen both while held in the vesting contract as well as when redeemed.":
    "This can happen both while held in the vesting contract as well as when redeemed.",
  "Get a Vega wallet": "Get a Vega wallet",
  "Associate VEGA tokens": "Associate VEGA tokens",
  "Nominate a validator": "Nominate a validator",
  "View Governance proposals": "View Governance proposals",
  "This tranche unlocked prior to the token launch on 3rd Sept 2021. These tokens were all issued to institutions for distribution to purchasers, and to support listings and liquidity. They were unlocked early to ensure a smooth launch, but not sold or traded prior to the launch.":
    "This tranche unlocked prior to the token launch on 3rd Sept 2021. These tokens were all issued to institutions for distribution to purchasers, and to support listings and liquidity. They were unlocked early to ensure a smooth launch, but not sold or traded prior to the launch.",
  "VEGA token holders can vote on proposed changes to the network and create proposals.":
    "VEGA token holders can vote on proposed changes to the network and create proposals.",
  "VEGA token holders can nominate a validator node and receive staking rewards.":
    "VEGA token holders can nominate a validator node and receive staking rewards.",
  "USE YOUR VEGA TOKENS": "USE YOUR VEGA TOKENS",
  "Check your vesting VEGA tokens": "Check your vesting VEGA tokens",
  "Tokens from this Tranche have been redeemed":
    "Tokens from this Tranche have been redeemed",
  "You have redeemed {{redeemedAmount}} VEGA tokens from this tranche. They are now free to transfer from your Ethereum wallet.":
    "You have redeemed {{redeemedAmount}} VEGA tokens from this tranche. They are now free to transfer from your Ethereum wallet.",
  "The VEGA token address is {{address}}, make sure you add this to your wallet to see your tokens":
    "The VEGA token address is {{address}}, make sure you add this to your wallet to see your tokens",
  "Go to <stakingLink>staking</stakingLink> or <governanceLink>governance</governanceLink> to see how you can use your unlocked tokens":
    "Go to <stakingLink>staking</stakingLink> or <governanceLink>governance</governanceLink> to see how you can use your unlocked tokens",
  liquidityNav: "DEX Liquidity",
  liquidityIntro:
    "Provide liquidity on decentralised exchanges and deposit the LP tokens in to our contract to earn rewards",
  liquidityIntroInstructionsLink:
    "You can read about our our incentive program in this blog post",
  liquidityTokensWalletTitle: "LP Tokens in connected wallet",
  liquidityTokensWalletIntro: "The following tokens can be staked to earn VEGA",
  liquidityTokensContractTitle: "LP Tokens earning rewards",
  liquidityTotalAvailableRewards: "Total available rewards",

  liquidityRewardsTitle: "Active liquidity rewards",
  liquidityTokenSushiAddress: "SLP pool/token address",
  liquidityTokenContractAddress: "Liquidty token contract address",
  rewardPerEpoch: "Reward per epoch (split between reward pool)",
  rewardTokenContractAddress: "Reward token contract address",
  lpTokensInRewardPool: "Tokens in reward pool",
  lpTokensEstimateAPY: "Estimated APY",
  lpTokenWithdrawSubmit:
    "Submitting this form will withdraw your entire staked balance & all rewards to your connected wallet:",
  liquidityTokenWithdrawBalance: "Withdrawal balance",
  liquidityTokenWithdrawRewards: "Withdrawal rewards",
  usersLpTokens: "Your LP tokens in connected wallet",
  depositToRewardPoolButton: "Deposit to reward pool",
  usersStakedLPTokens: "Your LP tokens in reward pool",
  usersPendingStakeLPTokens: "Your LP tokens in reward pool (next epoch)",
  usersShareOfPool: "Your share of pool",
  usersAccumulatedRewards: "Your accumulated rewards",
  alreadyDeposited: "You need to withdraw before you can deposit again",
  withdrawFromRewardPoolButton: "Withdraw LP tokens and VEGA tokens",

  liquidityTotalAvailableRewardsBalance: "Balance",
  liquidityStakedToken: "LP Token",
  liquidityStakedIntro:
    "Withdrawing your LP tokens from the contract will also claim the reward balance",
  liquidityStakedBalance: "LP token balance",
  liquidityStakedRewards: "Earned rewards",
  liquidityStakedWithdraw: "Withdraw",
  liquidityTokenTitle: "LP Token",
  liquidityTokenBalance: "Balance",
  liquidityTokenDeposit: "Deposit",
  liquidityTokenApprove: "Approve",
  liquidityComingSoon: "Liquidity rewards coming soon",
  "Keep track of locked tokens in your wallet with the VEGA (VESTING) token.":
    "Keep track of locked tokens in your wallet with the VEGA (VESTING) token.",
  "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.":
    "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
  mainnetDisableHome:
    "You will be able to use your VEGA tokens on the Vega network to nominate Validator nodes and participate in governance.",
  "VEGA in wallet": "VEGA in wallet",
  "Vesting associated": "Vesting associated",
  "Wallet associated": "Wallet associated",
};

export default en;
