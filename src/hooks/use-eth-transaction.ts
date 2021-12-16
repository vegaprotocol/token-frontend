import { BigNumber as EthersBigNumber, ethers } from "ethers";
import React, { useState } from "react";

import { useContracts } from "../contexts/contracts/contracts-context";
import {
  IVegaErc20Bridge,
  IVegaStaking,
  IVegaVesting,
} from "../lib/web3-utils";

interface VegaTX {
  event: ethers.Event | null;
  tx: ethers.providers.TransactionResponse;
  receipt: ethers.providers.TransactionReceipt | null;
}

class VegaEthUser {
  vesting: IVegaVesting;
  staking: IVegaStaking;
  erc20Bridge: IVegaErc20Bridge;
  confirmations: number;
  txs: VegaTX[] = [];
  address: string;

  constructor(
    address: string,
    confirmations: number,
    vesting: IVegaVesting,
    staking: IVegaStaking,
    erc20Bridge: IVegaErc20Bridge
  ) {
    this.confirmations = confirmations;
    this.vesting = vesting;
    this.staking = staking;
    this.erc20Bridge = erc20Bridge;
    this.address = address;

    const assetWithdrawnFilter =
      erc20Bridge.contract.filters.Asset_Withdrawn(address);
    const assetDepositFilter =
      erc20Bridge.contract.filters.Asset_Deposited(address);

    const bridgeDepositFilter =
      staking.contract.filters.Stake_Deposited(address);
    const bridgeRemoveFilter = staking.contract.filters.Stake_Removed(address);

    const vestingDepositFilter =
      staking.contract.filters.Stake_Deposited(address);
    const vestingRemoveFilter = staking.contract.filters.Stake_Removed(address);
    console.log(window.performance.now());

    // TODO could be filtered by block height in future
    // Get all the historic transactions for this user
    Promise.all([
      erc20Bridge.contract.queryFilter(assetWithdrawnFilter),
      erc20Bridge.contract.queryFilter(assetDepositFilter),
      staking.contract.queryFilter(bridgeDepositFilter),
      staking.contract.queryFilter(bridgeRemoveFilter),
      vesting.contract.queryFilter(vestingDepositFilter),
      vesting.contract.queryFilter(vestingRemoveFilter),
    ]).then((events) => {
      events.forEach((eventArray) => {
        eventArray.forEach((e) => {
          // TODO pass correct number of confirmations { "STAKE_DEPOSITED": 6, "STAKE_REMOVED": 1}
          this.handleEvent(e);
        });
      });
    });

    erc20Bridge.contract.on(
      assetWithdrawnFilter,
      (
        address: string,
        asset: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event);
      }
    );
    erc20Bridge.contract.on(
      assetDepositFilter,
      (
        address: string,
        asset: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event, this.confirmations);
      }
    );

    staking.contract.on(
      bridgeDepositFilter,
      (
        address: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event, this.confirmations);
      }
    );
    staking.contract.on(
      bridgeRemoveFilter,
      (
        address: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event);
      }
    );

    vesting.contract.on(
      vestingDepositFilter,
      (
        address: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event, this.confirmations);
      }
    );
    vesting.contract.on(
      vestingRemoveFilter,
      (
        address: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event, this.confirmations);
      }
    );
  }

  destroy() {
    // Clean up everything
    this.staking.contract.removeAllListeners();
    this.vesting.contract.removeAllListeners();
    this.erc20Bridge.contract.removeAllListeners();
  }

  async addTransaction(tx: ethers.providers.TransactionResponse) {
    this.mergeTransactions({
      tx,
      event: null,
      receipt: null,
    });
  }

  private mergeTransactions(tx: VegaTX) {
    this.txs = [
      // Replace any existing transaction in the array with this one
      ...this.txs.filter(({ tx: t }) => t.hash !== tx.tx.hash),
      tx,
    ];
    console.log("tx", window.performance.now(), this.txs);
  }

  private async handleEvent(event: ethers.Event, confirmations: number = 1) {
    const tx = await event.getTransaction();
    // If hash is not in tx array add it in e.g. if the user used etherscan to perform the transaction rather than the app
    this.mergeTransactions({
      tx,
      event,
      receipt: null,
    });

    // TODO error handling
    for (let i = 1; i <= confirmations; i++) {
      const receipt = await tx.wait(i);
      this.mergeTransactions({
        tx,
        event,
        receipt,
      });
    }
  }
}

// TODO if we used this multiple times then would have multiple classes kicking about
// TODO investigate use global
// Error handling in general for this whole thing
// Does not work with useTransaction hook. Need to optimisitically add transactions
export const useEthTransaction = (address: string, confirmations?: number) => {
  const { erc20Bridge, staking, vesting } = useContracts();
  const [vegaEhtUser, setVegaEthUser] = useState<VegaEthUser | null>(null);
  React.useEffect(() => {
    if (!vegaEhtUser && erc20Bridge && staking && vesting) {
      setVegaEthUser(
        new VegaEthUser(
          address,
          confirmations || 1,
          vesting,
          staking,
          erc20Bridge
        )
      );
    }
    return () => {
      vegaEhtUser?.destroy();
      setVegaEthUser(null);
    };
  }, [address, confirmations, erc20Bridge, staking, vesting]);

  // use effect to trigger destroy
};

// 0x72c22822A19D20DE7e426fB84aa047399Ddd8853
