import "./redemption-information.scss";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { RedemptionState } from "../redemption-reducer";
import { VestingTable } from "./vesting-table";
import { TrancheTable } from "../tranche-table";
import { Trans, useTranslation } from "react-i18next";
import { Callout } from "../../../components/callout";
import { HandUp } from "../../../components/icons";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import { truncateMiddle } from "../../../lib/truncate-middle";
import { Routes } from "../../router-config";

export const RedemptionInformation = ({
  state,
  address,
}: {
  state: RedemptionState;
  address: string;
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const {
    appState: {
      balanceFormatted,
      lien,
      totalVestedBalance,
      totalLockedBalance,
      trancheBalances,
    },
  } = useAppState();
  const { userTranches } = state;
  const filteredTranches = React.useMemo(
    () =>
      userTranches.filter((tr) => {
        const balance = trancheBalances.find(
          ({ id }) => id.toString() === tr.tranche_id.toString()
        );
        return (
          balance?.locked.isGreaterThan(0) || balance?.vested.isGreaterThan(0)
        );
      }),
    [trancheBalances, userTranches]
  );

  if (!filteredTranches.length) {
    return (
      <section data-testid="redemption-page">
        <p data-testid="redemption-no-balance">
          <Trans
            i18nKey="noVestingTokens"
            components={{
              tranchesLink: <Link to={Routes.TRANCHES} />,
            }}
          />
        </p>
      </section>
    );
  }

  return (
    <section className="redemption-information" data-testid="redemption-page">
      <p data-testid="redemption-description">
        {t(
          "{{address}} has {{balance}} VEGA tokens in {{tranches}} tranches of the vesting contract.",
          {
            address: truncateMiddle(address),
            balance: balanceFormatted.toString(),
            tranches: filteredTranches.length,
          }
        )}
      </p>
      {/* <p data-testid="redemption-unlocked-tokens">
        {t("A total of {{amount}} Unlocked Vega tokens.", {
          amount: totalVestedBalance.toString(),
        })}
      </p>
      <p data-testid="redemption-locked-tokens">
        {t("A total of {{amount}} Locked Vega tokens.", {
          amount: totalLockedBalance.toString(),
        })}
      </p>
      <p data-testid="redemption-staked-tokens">
        {t("{{stakedBalance}} are staked.", {
          stakedBalance: lien.toString(),
        })}
      </p>
      <p data-testid="redemption-page-description">
        <strong>
          {t("Use this page to redeem any unlocked VEGA tokens.")}
        </strong>
      </p>
      <p data-testid="redemption-note">{t("redemptionExplain")}</p> */}
      <VestingTable
        associated={lien}
        locked={totalLockedBalance}
        vested={totalVestedBalance}
      />
      {filteredTranches.length ? <h2>{t("Tranche breakdown")}</h2> : null}
      {filteredTranches.map((tr) => (
        <TrancheTable
          key={tr.tranche_id}
          tranche={tr}
          lien={lien}
          locked={
            trancheBalances.find(
              ({ id }) => id.toString() === tr.tranche_id.toString()
            )!.locked
          }
          vested={
            trancheBalances.find(
              ({ id }) => id.toString() === tr.tranche_id.toString()
            )!.vested
          }
          totalVested={totalVestedBalance}
          totalLocked={totalLockedBalance}
          onClick={() => history.push(`/vesting/${tr.tranche_id}`)}
        />
      ))}
      <Callout
        title={t("Stake your Locked VEGA tokens!")}
        icon={<HandUp />}
        intent="warn"
      >
        <p>{t("Find out more about Staking.")}</p>
        <Link to="/staking">{t("Stake VEGA tokens")}</Link>
      </Callout>
    </section>
  );
};
