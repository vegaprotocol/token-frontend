import { BigNumber } from "../../lib/bignumber";

interface PendingStakeProps {
  pendingAmount: BigNumber;
}

export const PendingStake = ({ pendingAmount }: PendingStakeProps) => {
  return <div>pending: {pendingAmount.toString()}</div>;
};
