const appChainId = process.env.REACT_APP_CHAIN as EthereumChainId;
const appEnv = process.env.REACT_APP_ENV;

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
    claimAddress: "0xd0db7b4c528c3a14648ced7064dd528595d5b273",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
    stakingBridge: "0x195064D33f09e0c42cF98E665D9506e0dC17de68",
  } as { [key: string]: string },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0x96a6f229BbbcA08095f0bC30088fcDfaeEDb07Ef",
    vegaTokenAddress:
      appEnv === "staging"
        ? "0x45984C4E9F3D55325fc6Fd2E260881EE3Ce9bbCD"
        : "0x5b634a05754283b6d9d7938dcca9d646425593eb",
    claimAddress: "0x5E3B1Fe757a3C41a9Ae0B903976CaDd415eb2e7b",
    lockedAddress: "0x0356782bfb61cf0b0463746bc6fe8766aacae8f0",
    stakingBridge: "0x7bd4a4789394fe5a93fc67ef64c47beb013e5450",
  } as { [key: string]: string },
};

const RewardsAddresses = {
  [EthereumChainIds.Mainnet]: {
    "SushiSwap VEGA/ETH": "0x285de24077440c53b1661287D170e3ae22de0a44",
    "SushiSwap VEGA/USDC": "0x49407c243c26f109b3c77c41dd83742164c20b5f",
  } as { [key: string]: string },
  [EthereumChainIds.Ropsten]: {
    "SushiSwap VEGA/ETH": "0xa93dd6912897c5fe8503a82234d829bc7905714b",
    "SushiSwap VEGA/USDC": "0xa93dd6912897c5fe8503a82234d829bc7905714b",
  } as { [key: string]: string },
};

const RewardsPoolAddresses = {
  [EthereumChainIds.Mainnet]: {
    "0x285de24077440c53b1661287D170e3ae22de0a44":
      "0x29c827ce49accf68a1a278c67c9d30c52fbbc348",
    "0x49407c243c26f109b3c77c41dd83742164c20b5f":
      "0x42b7B8f8F83fA5cbf0176f8c24Ad51EbcD4B5F17",
  } as { [key: string]: string },
  [EthereumChainIds.Ropsten]: {
    "0xa93dd6912897c5fe8503a82234d829bc7905714b":
      "0x29c827ce49accf68a1a278c67c9d30c52fbbc348",
    // Same address so cannot have same key twice
    // "0xcc382BF2451d5eA0990Ed881aDbc85Ca49B9E672":
    //   "0x42b7b8f8f83fa5cbf0176f8c24ad51ebcd4b5f17",
  } as { [key: string]: string },
};

/** Contract addresses for the different contracts in the VEGA ecosystem */
export const ADDRESSES = Addresses[appChainId];

/** Contract addresses for liquidity rewards for different markets */
export const REWARDS_ADDRESSES = RewardsAddresses[appChainId];
export const REWARDS_POOL_ADDRESSES = RewardsPoolAddresses[appChainId];

/**
 * The Chain ID the environment is configured for.
 * Normally this is 0x3 (Ropsten) for dev and 0x1 (Mainnet) for prod
 */
export const APP_CHAIN_ID = appChainId;
