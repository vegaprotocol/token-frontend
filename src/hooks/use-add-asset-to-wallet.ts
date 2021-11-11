import { ethers } from "ethers";
import React from "react";
import { useWeb3 } from "../contexts/web3-context/web3-context";
import * as Sentry from "@sentry/react";
import { appEnv, Networks } from "../config";

export const useAddAssetToWallet = (
  address: string,
  symbol: string,
  decimals: number,
  image: string
) => {
  const { provider } = useWeb3();

  return React.useCallback(async () => {
    try {
      await (provider as unknown as ethers.providers.JsonRpcProvider)?.send(
        "wallet_watchAsset",
        {
          // Ethers is wrong, this does work.
          // @ts-ignore
          type: "ERC20",
          options: {
            address,
            symbol: `${symbol}${
              // Add the environment if not mainnet
              appEnv === Networks.MAINNET
                ? ""
                : // Remove NET as VEGA(TESTNET) is too long
                  ` ${appEnv.replace("NET", "")}`
            }`,
            decimals,
            image,
          },
        }
      );
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [address, decimals, image, provider, symbol]);
};
