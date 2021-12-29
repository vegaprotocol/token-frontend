import { BigNumber as EthersBigNumber, ethers } from "ethers";
import throttle from "lodash/throttle";
import React from "react";
import { singletonHook } from "react-singleton-hook";

import { useContracts } from "../contexts/contracts/contracts-context";
import { IVegaStaking } from "../lib/web3-utils";

const REQUIRED_CONFIRMATIONS = {
  Stake_Removed: 1,
  Stake_Deposited: 6,
};

interface VegaTX {
  event: ethers.Event | null;
  tx: ethers.providers.TransactionResponse;
  receipt: ethers.providers.TransactionReceipt | null;
  requiredConfirmations: number;
  pending: boolean;
}

type Listeners = {
  tx: Function[];
};

class VegaEthUser {
  staking: IVegaStaking;
  confirmations: number;
  txs: VegaTX[] = [];
  address: string;
  listeners: Listeners = { tx: [] };
  depositFilter: ethers.EventFilter;
  removeFilter: ethers.EventFilter;

  constructor(address: string, confirmations: number, staking: IVegaStaking) {
    this.confirmations = confirmations;
    this.staking = staking;
    this.address = address;
    this.emit = throttle(this.emit, 1000);

    this.depositFilter = staking.contract.filters.Stake_Deposited(address);
    this.removeFilter = staking.contract.filters.Stake_Removed(address);

    staking.contract.on(
      this.depositFilter,
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
      this.removeFilter,
      (
        address: string,
        amount: EthersBigNumber,
        vegaPubKey: string,
        event: ethers.Event
      ) => {
        this.handleEvent(event);
      }
    );
  }

  destroy() {
    // Clean up everything
    this.staking.contract.removeAllListeners();
    this.off("tx");
  }

  fetchHistory() {
    // TODO could be filtered by block height in future
    // Get all the historic transactions for this user
    Promise.all([
      this.staking.contract.queryFilter(this.depositFilter),
      this.staking.contract.queryFilter(this.removeFilter),
    ]).then((events) => {
      events.forEach((eventArray) => {
        eventArray.forEach((e) => {
          // TODO pass correct number of confirmations { "STAKE_DEPOSITED": 6, "STAKE_REMOVED": 1}

          console.log(e);
          this.handleEvent(e);
        });
      });
    });
  }

  addTransaction = (
    tx: ethers.providers.TransactionResponse,
    requiredConfirmations = 1
  ) => {
    this.mergeTransactions({
      tx,
      event: null,
      receipt: null,
      pending: true,
      requiredConfirmations,
    });
  };

  private mergeTransactions(tx: VegaTX) {
    this.txs = [
      // Replace any existing transaction in the array with this one
      ...this.txs.filter(({ tx: t }) => t.hash !== tx.tx.hash),
      tx,
    ];

    this.emit();
  }

  private async handleEvent(event: ethers.Event, requiredConfirmations = 1) {
    const tx = await event.getTransaction();

    // If hash is not in tx array add it in e.g. if the user used etherscan to perform the transaction rather than the app
    this.mergeTransactions({
      tx,
      event,
      receipt: null,
      pending: tx.confirmations < requiredConfirmations,
      requiredConfirmations:
        REQUIRED_CONFIRMATIONS[event.event as "Stake_Deposited"] || 1,
    });

    // TODO error handling
    for (let i = 1; i <= requiredConfirmations; i++) {
      const receipt = await tx.wait(i);
      this.mergeTransactions({
        tx,
        event,
        receipt,
        pending: receipt.confirmations < requiredConfirmations,
        requiredConfirmations:
          REQUIRED_CONFIRMATIONS[event.event as "Stake_Deposited"] || 1,
      });
    }
  }

  on(event: "tx", cb: Function) {
    this.listeners[event].push(cb);
  }

  off(event: "tx") {
    // TODO: handle only remove the function passed in
    this.listeners[event] = [];
  }

  emit() {
    this.listeners.tx.forEach((cb) => cb(this.txs));
  }
}

type UseEthTransaction = {
  txs: VegaTX[];
  addTx: (
    tx: ethers.providers.TransactionResponse,
    confirmations: number
  ) => void;
};

const init: UseEthTransaction = {
  txs: [],
  addTx: () => {
    throw new Error("something went wrong");
  },
};

export function useEthTransactionImpl(
  address: string,
  confirmations = 1
): UseEthTransaction {
  const { staking } = useContracts();
  const [txs, setTxs] = React.useState<VegaTX[]>([]);

  const instance = React.useMemo(() => {
    return new VegaEthUser(address, confirmations, staking);
  }, [address, confirmations, staking]);

  React.useEffect(() => {
    instance.on("tx", (incoming: VegaTX[]) => {
      setTxs(incoming);
    });

    instance.fetchHistory();

    return () => {
      instance.destroy();
    };
  }, [instance]);

  return { txs, addTx: instance.addTransaction };
}

export const useEthTransaction = singletonHook(
  init,
  useEthTransactionImpl as any
);
