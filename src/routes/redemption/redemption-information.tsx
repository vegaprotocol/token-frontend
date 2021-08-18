import { useAppState } from "../../contexts/app-state/app-state-context";

export const RedemptionInformation = () => {
  const {
    appState: { address, balanceFormatted },
  } = useAppState();
  const totalTranches = 2;
  const unlockedBalance = 0.0005;
  const lockedBalance = 0.0005;
  const stakedBalance = 0.0005;

  return (
    <section data-testid="redemption-page">
      <div data-testid="redemption-description">
        {address} has {balanceFormatted} VEGA tokens in {totalTranches} tranches
        of the vesting contract.
      </div>
      <div data-testid="redemption-unlocked-tokens">
        A total of {unlockedBalance} Unlocked Vega tokens.
      </div>
      <div data-testid="redemption-locked-tokens">
        A total of {lockedBalance} Locked Vega tokens.
      </div>
      <div data-testid="redemption-staked-tokens">
        {stakedBalance} are staked.
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
