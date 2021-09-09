import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";

export function useWeb3() {
  const { provider } = useAppState();
  const vesting = React.useMemo(() => {
    return new Web3(provider);
  }, [provider]);
  return vesting;
}
