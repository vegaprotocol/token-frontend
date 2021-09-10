export type EthereumChainId = "0x1" | "0x3" | "0x4" | "0x5" | "0x2a";
export type EthereumChainName =
  | "Mainnet"
  | "Ropsten"
  | "Rinkeby"
  | "Goerli"
  | "Kovan";

export const EthereumChainNames: Record<EthereumChainId, EthereumChainName> = {
  "0x1": "Mainnet",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
  "0x2a": "Kovan",
};

export const EthereumChainIds: Record<EthereumChainName, EthereumChainId> = {
  Mainnet: "0x1",
  Ropsten: "0x3",
  Rinkeby: "0x4",
  Goerli: "0x5",
  Kovan: "0x2a",
};

const Addresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
    claimAddress: "0xd1Bdf85dB6Af63f45211dB95928d938abCc52dC8",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
    stakingBridge: "0x195064D33f09e0c42cF98E665D9506e0dC17de68",
  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0xfc9Ad8fE9E0b168999Ee7547797BC39D55d607AA",
    vegaTokenAddress: "0x5b634a05754283b6d9d7938dcca9d646425593eb",
    claimAddress: "0x695eD7f6AcA81201d1D92107f120579CaAe2E5F2",
    lockedAddress: "0x0356782bfb61cf0b0463746bc6fe8766aacae8f0",
    stakingBridge: "0x7bd4a4789394fe5a93fc67ef64c47beb013e5450",
  },
};

const RewardsAddresses = {
  [EthereumChainIds.Mainnet]: {
    "Sushi Swap VEGA/ETH": "0x29C827Ce49aCCF68A1a278C67C9D30c52fBbC348",
    "Sushi Swap VEGA/USDC": "0x42b7B8f8F83fA5cbf0176f8c24Ad51EbcD4B5F17",
  },
  [EthereumChainIds.Ropsten]: {
    "Sushi Swap VEGA/ETH": "0xbb12cd85C71DC11f4d82fc6E2E68c343c329d85E",
    "Sushi Swap VEGA/USDC": "0xbb12cd85C71DC11f4d82fc6E2E68c343c329d85E",
  },
};

const appChainId = process.env.REACT_APP_CHAIN as EthereumChainId;

/** Contract addresses for the different contracts in the VEGA ecosystem */
export const ADDRESSES = Addresses[appChainId];

/** Contract addresses for liquidity rewards for different markets */
export const REWARDS_ADDRESSES = RewardsAddresses[appChainId];

/**
 * The Chain ID the environment is configured for.
 * Normally this is 0x3 (Ropsten) for dev and 0x1 (Mainnet) for prod
 */
export const APP_CHAIN_ID = appChainId;
