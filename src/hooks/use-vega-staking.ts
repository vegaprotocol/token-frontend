import React from "react";
import Web3 from "web3";
import { useAppState } from "../contexts/app-state/app-state-context";
import { IVegaStaking, PromiEvent } from "../lib/web3-utils";
// @ts-ignore
import StakingAbi from "../lib/VEGA_WEB3/vega-staking";
import BigNumber from "bignumber.js";
import { Flags } from "../flags";

class StakingShim implements IVegaStaking {
  checkTransferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): PromiEvent {
    throw new Error("Method not implemented.");
  }
  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    return new BigNumber(0);
  }
  async totalStaked(): Promise<BigNumber> {
    return new BigNumber(0);
  }
  removeStake(address: string, amount: string, vegaKey: string): PromiEvent {
    throw new Error("Method not implemented.");
  }
  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  addStake(address: string, amount: string, vegaKey: string): PromiEvent {
    throw new Error("Method not implemented.");
  }
  checkAddStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export const useVegaStaking = () => {
  const {
    provider,
    appState: { contractAddresses, decimals },
  } = useAppState();

  return React.useMemo<IVegaStaking>(() => {
    if (Flags.MAINNET_DISABLED) {
      return new StakingShim();
    }
    const web3 = new Web3(provider);
    return new StakingAbi(web3, contractAddresses.stakingBridge, decimals);
  }, [contractAddresses.stakingBridge, provider, decimals]);
};
