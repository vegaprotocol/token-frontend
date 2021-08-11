import type { EventData } from "web3-eth-contract";
import { Tranche, TrancheEvents, TrancheUser } from "./vega-web3-types";
import uniq from "lodash/uniq";
import Web3 from "web3";
import BigNumber from "bignumber.js";

export function createUserTransactions(events: EventData[]) {
  return events.map((event) => {
    return {
      amount: new BigNumber(Web3.utils.fromWei(event.returnValues.amount)),
      user: event.returnValues.user,
      tranche_id: event.returnValues.tranche_id,
      tx: event.transactionHash,
    };
  });
}

export function getUsersInTranche(
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
    const deposits = createUserTransactions(userDeposits);
    const withdrawals = createUserTransactions(userWithdraws);

    const total_tokens = BigNumber.sum.apply(
      null,
      deposits.map((d) => d.amount)
    );
    const withdrawn_tokens = BigNumber.sum.apply(
      null,
      withdrawals.map((w) => w.amount)
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

export function sumFromEvents(events: EventData[]) {
  // BigNumber.sum with an empty array will return NaN so early return with 0 here
  if (!events.length) {
    return new BigNumber(0);
  }

  const amounts = events.map(
    (e) => new BigNumber(Web3.utils.fromWei(e.returnValues.amount))
  );

  return BigNumber.sum.apply(null, amounts);
}

export function getLockedAmount(
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

export function createTransactions(events: EventData[]) {
  return events.map((event) => {
    return {
      amount: new BigNumber(Web3.utils.fromWei(event.returnValues.amount)),
      user: event.returnValues.user,
      tx: event.transactionHash,
    };
  });
}

export function getTranchesFromHistory(events: EventData[]): Tranche[] {
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
      const total_added = sumFromEvents(balanceAddedEvents);
      const total_removed = sumFromEvents(balanceRemovedEvents);

      // get locked amount
      const locked_amount = getLockedAmount(
        total_added,
        cliff_start,
        tranche_duration
      );

      // get all deposits and withdrawals
      const deposits = createTransactions(balanceAddedEvents);
      const withdrawals = createTransactions(balanceRemovedEvents);

      // get all users
      const uniqueAddresses = uniq(
        balanceAddedEvents.map((event) => event.returnValues.user)
      );
      const users = getUsersInTranche(
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
