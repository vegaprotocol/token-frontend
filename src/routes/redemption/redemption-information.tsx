import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { RedemptionState } from "./redemption-reducer";

export const RedemptionInformation = ({
  state,
}: {
  state: RedemptionState;
}) => {
  const {
    appState: { address, balanceFormatted },
  } = useAppState();
  const { userTranches } = state;
  if (!userTranches.length) {
    return (
      <section data-testid="redemption-page">
        <div data-testid="redemption-no-balance">
          You do not have any vesting VEGA tokens. Switch to another Ethereum
          key to check what can be redeemed.
        </div>
      </section>
    );
  }

  return (
    <section data-testid="redemption-page">
      <div data-testid="redemption-description">
        {address} has {balanceFormatted} VEGA tokens in {userTranches.length}{" "}
        tranches of the vesting contract.
      </div>
      <div data-testid="redemption-unlocked-tokens">
        A total of {state.totalVestedBalance.toString()} Unlocked Vega tokens.
      </div>
      <div data-testid="redemption-locked-tokens">
        A total of {state.totalLockedBalance.toString()} Locked Vega tokens.
      </div>
      <div data-testid="redemption-staked-tokens">
        {state.stakedBalance.toString()} are staked.
      </div>
      <div data-testid="redemption-page-description">
        <strong>Use this page to redeem any unlocked VEGA tokens</strong>
      </div>
      <div data-testid="redemption-note">
        Note: The redeem function attempts to redeem all unlocked tokens from a
        tranche. However, it will only work if all the amount you are redeeming
        would not reduce the amount you have staked while vesting.
      </div>
    </section>
  );
};
