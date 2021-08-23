import "./redemption-information.scss";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { RedemptionState } from "./redemption-reducer";
import { VestingTable } from "./vesting-table";
import { TrancheTable } from "./tranche-table";
import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";

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
    lien,
    balances,
  } = state;
  if (!userTranches.length) {
    return (
      <section data-testid="redemption-page">
        <div data-testid="redemption-no-balance">
          {t(
            "You do not have any vesting VEGA tokens. Switch to another Ethereum key to check what can be redeemed."
          )}
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
          stakedBalance: lien.toString(),
        })}
      </div>
      <div data-testid="redemption-page-description">
        <strong>
          {t("Use this page to redeem any unlocked VEGA tokens.")}
        </strong>
      </div>
      <Callout title={t("Stake your Locked VEGA tokens!")}>
        <p>{t("Find out more about Staking.")}</p>
      </Callout>
      <div data-testid="redemption-note">{t("redemptionExplain")}</div>
      <VestingTable
        staked={lien}
        locked={totalLockedBalance}
        vested={totalVestedBalance}
      />
      {userTranches
        .filter((tr) => {
          const balance = balances.find(
            ({ id }) => id.toString() === tr.tranche_id.toString()
          )!;
          return (
            balance.locked.isGreaterThan(0) || balance.vested.isGreaterThan(0)
          );
        })
        .map((tr) => (
          <TrancheTable
            key={tr.tranche_id}
            tranche={tr}
            address={address!}
            lien={lien}
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
