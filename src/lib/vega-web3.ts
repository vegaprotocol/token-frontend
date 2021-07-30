import Web3 from "web3";
import vestingAbi from "./vesting_abi.json";
import type { Contract, EventData } from "web3-eth-contract";
import _ from "lodash";
import { EthereumChainId, EthereumChainIds } from "./vega-web3-utils";
import {
  IVegaWeb3,
  Tranche,
  TrancheEvents,
  TrancheUser,
} from "./vega-web3-types";
import { MockPromiEvent } from "./__mocks__/vega-web3";
import { PromiEvent } from "web3-core";

export interface ContractAddress {
  vestingAddress: string;
  vegaTokenAddress: string;
}

export const Addresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
  },
  [EthereumChainIds.Ropsten]: {
    vestingAddress: "0x08C06ECDCf9b8f45e3cF1ec29B82eFd0171341D9",
    vegaTokenAddress: "0x16480156222D4525f02F0F2BdF8A45A23bd26431",
  },
};

class VegaWeb3 implements IVegaWeb3 {
  public chainId: EthereumChainId;
  private vestingInstance: Contract;
  public web3: Web3;
  public currentAccount: string | null = null;
  private provider: any;

  constructor(chainId: EthereumChainId) {
    this.chainId = chainId;
    const contractsAddresses = Addresses[chainId];

    if (!contractsAddresses) {
      throw new Error(" Could not find contract addresses for network");
    }

    this.provider = new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/5aff9e61ad844bcf982d0d0c3f1d29f1"
    );
    this.web3 = new Web3(this.provider);
    this.vestingInstance = new this.web3.eth.Contract(
      // @ts-ignore
      vestingAbi,
      contractsAddresses.vestingAddress
    );
  }

  async getUserBalanceAllTranches(account: string): Promise<string> {
    return this.vestingInstance.methods.user_total_all_tranches(account).call();
  }

  async getTotalTokens() {}

  async validateCode() {
    return Promise.resolve(true);
  }

  private createUserTransactions(events: EventData[]) {
    return events.map((event) => {
      return {
        amount: parseFloat(this.web3.utils.fromWei(event.returnValues.amount)),
        user: event.returnValues.user,
        tranche_id: event.returnValues.tranche_id,
        tx: event.transactionHash,
      };
    });
  }

  private getUsersInTranche(
    balanceAddedEvents: EventData[],
    balanceRemovedEvents: EventData[],
    addresses: string[]
  ): TrancheUser[] {
    return addresses.map((address) => {
      const userDeposits = balanceAddedEvents.filter(
        (event) => event.returnValues.user === address
      );
      const userWithdraws = balanceRemovedEvents.filter(
        (event) => event.returnValues.user === address
      );
      const deposits = this.createUserTransactions(userDeposits);
      const withdrawals = this.createUserTransactions(userWithdraws);

      const total_tokens = _.sumBy(deposits, "amount");
      const withdrawn_tokens = _.sumBy(withdrawals, "amount");
      const remaining_tokens = total_tokens - withdrawn_tokens;

      return {
        address,
        deposits,
        withdrawals,
        total_tokens,
        withdrawn_tokens,
        remaining_tokens,
      };
    });
  }

  private sumFromEvents(events: EventData[]) {
    const amounts = events.map((e) =>
      parseFloat(this.web3.utils.fromWei(e.returnValues.amount))
    );
    return _.sum(amounts);
  }

  private getLockedAmount(
    totalAdded: number,
    cliffStart: number,
    trancheDuration: number
  ) {
    let amount = 0;
    const ts = Math.round(new Date().getTime() / 1000);
    const tranche_progress = (ts - cliffStart) / trancheDuration;

    if (tranche_progress < 0) {
      amount = totalAdded;
    } else if (tranche_progress < 1) {
      amount = totalAdded * (1 - tranche_progress);
    }

    return amount;
  }

  private createTransactions(events: EventData[]) {
    return events.map((event) => {
      return {
        amount: parseFloat(this.web3.utils.fromWei(event.returnValues.amount)),
        user: event.returnValues.user,
        tx: event.transactionHash,
      };
    });
  }

  private getTranchesFromHistory(events: EventData[]): Tranche[] {
    return events
      .filter((event) => event.event === TrancheEvents.Created)
      .map((event) => {
        const tranche_id = event.returnValues.tranche_id;
        const balanceAddedEvents = events.filter(
          (e) =>
            e.event === TrancheEvents.BalanceAdded &&
            e.returnValues.tranche_id === tranche_id
        );
        const balanceRemovedEvents = events.filter(
          (e) =>
            e.event === TrancheEvents.BalanceRemoved &&
            e.returnValues.tranche_id === tranche_id
        );

        // get tranche start and end dates
        const tranche_duration = parseInt(event.returnValues.duration);
        const cliff_start = parseInt(event.returnValues.cliff_start);
        const tranche_start = new Date(cliff_start * 1000);
        const tranche_end = new Date((cliff_start + tranche_duration) * 1000);

        // get added and removed values
        const total_added = this.sumFromEvents(balanceAddedEvents);
        const total_removed = this.sumFromEvents(balanceRemovedEvents);
        // get locked amount
        const locked_amount = this.getLockedAmount(
          total_added,
          cliff_start,
          tranche_duration
        );

        // get all deposits and withdrawals
        const deposits = this.createTransactions(balanceAddedEvents);
        const withdrawals = this.createTransactions(balanceRemovedEvents);

        // get all users
        const uniqueAddresses = _.uniq(
          balanceAddedEvents.map((event) => event.returnValues.user)
        );
        const users = this.getUsersInTranche(
          balanceAddedEvents,
          balanceRemovedEvents,
          uniqueAddresses
        );

        return {
          tranche_id,
          tranche_start,
          tranche_end,
          total_added,
          total_removed,
          locked_amount,
          deposits,
          withdrawals,
          users,
        };
      });
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.vestingInstance.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return this.getTranchesFromHistory(events);
  }

  commitClaim(): PromiEvent<any> {
    const promiEvent = new MockPromiEvent();

    // start tx on next tick so that UI can update
    setTimeout(() => {
      const confirm = window.confirm("[TEST]: Confirm transaction");

      if (confirm) {
        promiEvent.trigger("transactionHash", "0xTEST_HASH");

        setTimeout(() => {
          promiEvent.trigger("receipt", { receipt: true });
        }, 1000);
      } else {
        promiEvent.trigger("error", new Error("Something went wrong"));
      }
    }, 0);

    // @ts-ignore
    return promiEvent;
  }

  async getUserBalancesPerTranche() {}

  async redeem() {}

  async commitCode() {}

  async revealCode() {}
}

export default VegaWeb3;
