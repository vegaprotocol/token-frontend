import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { ethers } from "ethers";
import React from "react";

export function useWeb3() {
  const context = useWeb3React();

  const fallback: Web3ReactContextInterface = React.useMemo(() => {
    return {
      ...context,
      library: new ethers.providers.InfuraProvider(
        3,
        "4f846e79e13f44d1b51bbd7ed9edefb8"
      ),
      chainId: 3,
    };
  }, [context]);

  // Use the browser/extension/connected wallet if active
  // otherwise use the fallback
  if (context.active) {
    return context;
  } else {
    return fallback;
  }
}
