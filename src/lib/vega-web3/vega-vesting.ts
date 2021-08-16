import Web3 from "web3";
import type { Contract, EventData } from "web3-eth-contract";
import vestingAbi from "../abis/vesting_abi.json";
import { Tranche, TrancheEvents, TrancheUser } from "./vega-web3-types";
import uniq from "lodash/uniq";
import { BigNumber } from "../bignumber";
import { addDecimal } from "../decimals";

export default class VegaVesting {
  private web3: Web3;
  private contract: Contract;

  constructor(web3: Web3, vestingAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      // @ts-ignore
      vestingAbi,
      vestingAddress
    );
  }

  async getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    const amount = await this.contract.methods
      .user_total_all_tranches(account)
      .call();
    return new BigNumber(amount);
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return this.getTranchesFromHistory(events);
  }

  private createUserTransactions(events: EventData[]) {
    return events.map((event) => {
      return {
        amount: new BigNumber(
          addDecimal(new BigNumber(event.returnValues.amount))
        ),
        user: event.returnValues.user,
        tranche_id: parseInt(event.returnValues.tranche_id),
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
      const total_tokens = deposits.reduce(
        (pre, cur) => pre.plus(cur.amount),
        new BigNumber(0)
      );
      const withdrawn_tokens = withdrawals.reduce(
        (pre, cur) => pre.plus(cur.amount),
        new BigNumber(0)
      );
      const remaining_tokens = total_tokens.minus(withdrawn_tokens);

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
    const amounts = events.map(
      (e) => new BigNumber(addDecimal(new BigNumber(e.returnValues.amount)))
    );
    // Start with a 0 so if there are none there is no NaN
    return BigNumber.sum.apply(null, [new BigNumber(0), ...amounts]);
  }

  private getLockedAmount(
    totalAdded: BigNumber,
    cliffStart: number,
    trancheDuration: number
  ) {
    let amount = new BigNumber(0);
    const ts = Math.round(new Date().getTime() / 1000);
    const tranche_progress = (ts - cliffStart) / trancheDuration;

    if (tranche_progress < 0) {
      amount = totalAdded;
    } else if (tranche_progress < 1) {
      amount = totalAdded.times(1 - tranche_progress);
    }

    return amount;
  }

  private createTransactions(events: EventData[]) {
    return events.map((event) => {
      return {
        amount: new BigNumber(
          addDecimal(new BigNumber(event.returnValues.amount))
        ),
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
            e.returnValues.tranche_id === tranche_id.toString()
        );
        const balanceRemovedEvents = events.filter(
          (e) =>
            e.event === TrancheEvents.BalanceRemoved &&
            e.returnValues.tranche_id === tranche_id.toString()
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
        const uniqueAddresses = uniq(
          balanceAddedEvents.map((event) => event.returnValues.user)
        );
        const users = this.getUsersInTranche(
          balanceAddedEvents,
          balanceRemovedEvents,
          uniqueAddresses
        );

        return {
          tranche_id: parseInt(tranche_id),
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
}
