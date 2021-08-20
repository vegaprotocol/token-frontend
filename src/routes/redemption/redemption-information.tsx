import "./redemption-information.scss";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { RedemptionState } from "./redemption-reducer";
import { VestingTable } from "./vesting-table";
import { TrancheTable } from "./tranche-table";
import { useTranslation } from "react-i18next";

export const RedemptionInformation = ({
  state,
}: {
  state: RedemptionState;
}) => {
  const { t } = useTranslation();
  const {
    appState: { address, balanceFormatted },
  } = useAppState();
  const {
    userTranches,
    totalVestedBalance,
    totalLockedBalance,
    stakedBalance,
    balances,
  } = state;
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
    <section className="redemption-information" data-testid="redemption-page">
      <div data-testid="redemption-description">
        {t(
          "{{address}} has {{balance}} VEGA tokens in {{tranches}} tranches of the vesting contract.",
          {
            address,
            balance: balanceFormatted,
            tranches: userTranches.length,
          }
        )}
      </div>
      <div data-testid="redemption-unlocked-tokens">
        {t("A total of {{amount}} Unlocked Vega tokens.", {
          amount: totalVestedBalance.toString(),
        })}
      </div>
      <div data-testid="redemption-locked-tokens">
        {t("A total of {{amount}} Locked Vega tokens.", {
          amount: totalLockedBalance.toString(),
        })}
      </div>
      <div data-testid="redemption-staked-tokens">
        {t("{{stakedBalance}} are staked.", {
          stakedBalance: stakedBalance.toString(),
        })}
      </div>
      <div data-testid="redemption-page-description">
        <strong>
          {t("Use this page to redeem any unlocked VEGA tokens.")}
        </strong>
      </div>
      <div data-testid="redemption-note">
        {t(
          "Note: The redeem function attempts to redeem all unlocked tokens from a tranche. However, it will only work if all the amount you are redeeming would not reduce the amount you have staked while vesting."
        )}
      </div>
      <VestingTable
        staked={stakedBalance}
        locked={totalLockedBalance}
        vested={totalVestedBalance}
      />
      {userTranches.map((tr) => (
        <TrancheTable
          key={tr.tranche_id}
          tranche={tr}
          address={address!}
          locked={
            balances.find(
              ({ id }) => id.toString() === tr.tranche_id.toString()
            )!.locked
          }
          vested={
            balances.find(
              ({ id }) => id.toString() === tr.tranche_id.toString()
            )!.vested
          }
        />
      ))}
    </section>
  );
};
