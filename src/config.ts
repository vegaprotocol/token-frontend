import {EthereumChainId, EthereumChainIds } from "./lib/web3-utils";
import {DexContractState } from "./routes/liquidity/dex-liquidity-reducer";

type IAddressList = {
  vestingAddress: string
  vegaTokenAddress: string
  claimAddress: string
  lockedAddress: string
  stakingBridge: string
  dexLiquidityRewards: DexContractState
}

type IAddresses = Record<any, IAddressList>

export const Addresses: IAddresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
    claimAddress: "0xd1Bdf85dB6Af63f45211dB95928d938abCc52dC8",
    lockedAddress: "0x78344c7305d73a7a0ac3c94cd9960f4449a1814e",
    stakingBridge: "0x195064D33f09e0c42cF98E665D9506e0dC17de68",

  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0xfc9Ad8fE9E0b168999Ee7547797BC39D55d607AA",
    vegaTokenAddress: "0xFa521aDcc11925266A518CdE33386FcD9cF2A4A6",
    claimAddress: "0x695eD7f6AcA81201d1D92107f120579CaAe2E5F2",
    lockedAddress: "0x0356782bfb61cf0b0463746bc6fe8766aacae8f0",
    stakingBridge: "0x1B57E5393d949242a9AD6E029E2f8A684BFbBC08",
    dexLiquidityRewards: {
      "sushi-vega-eth": {
        title: "SUSHI/VEGA/ETH",
        address: "0xf3153577008864d23805Dd0912340AF5604bb544"
      },
      "sushi-vega-usdc": {
        title: "SUSHI/VEGA/USDC",
        address: "0xf3153577008864d23805Dd0912340AF5604bb544"
      },
      "uni-vega-eth": {
        title: "UNI/VEGA/ETH",
        address: "0xf3153577008864d23805Dd0912340AF5604bb544"
      },
      "uni-vega-usdc": {
        title: "UNI/VEGA/USDC",
        address: "0xf3153577008864d23805Dd0912340AF5604bb544"
      }
    },
  },
};

const appChainId = process.env.REACT_APP_CHAIN as EthereumChainId;

/** Contract addresses for the different contracts in the VEGA ecosystem */
export const ADDRESSES = Addresses[appChainId];

/**
 * The Chain ID the environment is configured for.
 * Normally this is 0x3 (Ropsten) for dev and 0x1 (Mainnet) for prod
 */
export const APP_CHAIN_ID = appChainId;
