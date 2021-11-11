import { ethers } from "ethers";
import React from "react";
import { useWeb3 } from "../contexts/web3-context/web3-context";
import * as Sentry from "@sentry/react";

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
            symbol,
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
