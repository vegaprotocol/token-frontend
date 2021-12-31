import "./pending-stake.scss";

import { BigNumber } from "../../lib/bignumber";

interface PendingStakeProps {
  pendingAmount: BigNumber;
}

export const PendingStake = ({ pendingAmount }: PendingStakeProps) => {
  return (
    <div className="your-stake__container">
      <h2>Pending Nomination</h2>
      <p>Pending nomination for next epoch: {pendingAmount.toString()} $VEGA</p>
      <button type="button" className="button-secondary button-secondary--dark">
        Cancel pending epoch nomination
      </button>
    </div>
  );
};
