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

export const Addresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
    claimAddress: "",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0x08C06ECDCf9b8f45e3cF1ec29B82eFd0171341D9",
    vegaTokenAddress: "0x16480156222D4525f02F0F2BdF8A45A23bd26431",
    claimAddress: "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21",
    lockedAddress: "",
  },
};
