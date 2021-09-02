import type { EventData } from "web3-eth-contract";
import { Tranche, TrancheEvents, TrancheUser } from "./vega-web3-types";
import uniq from "lodash/uniq";
import { BigNumber } from "../../lib/bignumber";
import { addDecimal } from "../decimals";

export function createUserTransactions(events: EventData[], decimals: number) {
  return events.map((event) => {
    return {
      amount: new BigNumber(
        addDecimal(new BigNumber(event.returnValues.amount), decimals)
      ),
      user: event.returnValues.user,
      tranche_id: parseInt(event.returnValues.tranche_id),
      tx: event.transactionHash,
    };
  });
}

export function getUsersInTranche(
  balanceAddedEvents: EventData[],
  balanceRemovedEvents: EventData[],
  addresses: string[],
  decimals: number
): TrancheUser[] {
  return addresses.map((address) => {
    const userDeposits = balanceAddedEvents.filter(
      (event) => event.returnValues.user === address
    );
    const userWithdraws = balanceRemovedEvents.filter(
      (event) => event.returnValues.user === address
    );
    const deposits = createUserTransactions(userDeposits, decimals);
    const withdrawals = createUserTransactions(userWithdraws, decimals);
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

export function sumFromEvents(events: EventData[], decimals: number) {
  const amounts = events.map(
    (e) =>
      new BigNumber(addDecimal(new BigNumber(e.returnValues.amount), decimals))
  );
  // Start with a 0 so if there are none there is no NaN
  return BigNumber.sum.apply(null, [new BigNumber(0), ...amounts]);
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

export function createTransactions(events: EventData[], decimals: number) {
  return events.map((event) => {
    return {
      amount: new BigNumber(
        addDecimal(new BigNumber(event.returnValues.amount), decimals)
      ),
      user: event.returnValues.user,
      tx: event.transactionHash,
    };
  });
}

export function getTranchesFromHistory(
  events: EventData[],
  decimals: number
): Tranche[] {
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
      const total_added = sumFromEvents(balanceAddedEvents, decimals);
      const total_removed = sumFromEvents(balanceRemovedEvents, decimals);
      // get locked amount
      const locked_amount = getLockedAmount(
        total_added,
        cliff_start,
        tranche_duration
      );

      // get all deposits and withdrawals
      const deposits = createTransactions(balanceAddedEvents, decimals);
      const withdrawals = createTransactions(balanceRemovedEvents, decimals);

      // get all users
      const uniqueAddresses = uniq(
        balanceAddedEvents.map((event) => event.returnValues.user)
      );
      const users = getUsersInTranche(
        balanceAddedEvents,
        balanceRemovedEvents,
        uniqueAddresses,
        decimals
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
