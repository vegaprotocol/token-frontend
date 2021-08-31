import "./tranche.scss";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import { TrancheDates } from "./tranche-dates";
import { useTranslation } from "react-i18next";
import { BulletHeader } from "../../components/bullet-header";
import { ProgressBar } from "./progress-bar";
import { Colors } from "../../colors";
import { BigNumber } from "../../lib/bignumber";
import { getAbbreviatedNumber } from "../../lib/abbreviate-number";
import { Routes } from "../router-config";
import { Tranche as TrancheType } from "../../lib/vega-web3/vega-web3-types";
import {TrancheTitle} from "./tranche-title";
import {useAppState} from "../../contexts/app-state/app-state-context";

export const Tranche = ({ tranches }: { tranches: TrancheType[] }) => {
  const { t } = useTranslation();
  const { trancheId } = useParams<{ trancheId: string }>();
  const { appState } = useAppState();
  const tranche = tranches.find(
    (tranche) => tranche.tranche_id === parseInt(trancheId)
  );

  if (!tranche) {
    return <Redirect to={Routes.NOT_FOUND} />;
  }

  let locked_percentage = tranche.locked_amount
    .div(tranche.total_added)
    .times(100);
  let removed_percentage = tranche.total_removed
    .div(tranche.total_added)
    .times(100);
  if (tranche.total_added.toNumber() === 0) {
    locked_percentage = new BigNumber(0);
    removed_percentage = new BigNumber(0);
  }

  return (
    <>
      <BulletHeader tag="h2">
        {t("Tranche")} #{trancheId}&nbsp;
        <TrancheTitle chainId={appState.chainId} contract={appState.contractAddresses.vestingAddress} id={tranche.tranche_id} />
      </BulletHeader>
      <div style={{ marginTop: 20 }}>
        <TrancheDates start={tranche.tranche_start} end={tranche.tranche_end} />
      </div>
      <div>
        <h3 className="tranche__progress-title">{t("Locked")}</h3>
        <div className="tranche__progress-info">
          <ProgressBar
            percentage={locked_percentage.toNumber()}
            width={300}
            color={Colors.PINK}
          />
          <span>
            {getAbbreviatedNumber(tranche.locked_amount)} of (
            {getAbbreviatedNumber(tranche.total_added)})
          </span>
        </div>
      </div>
      <div>
        <h3 className="tranche__progress-title">{t("Redeemed")}</h3>
        <div className="tranche__progress-info">
          <ProgressBar
            percentage={removed_percentage.toNumber()}
            width={300}
            color={Colors.PINK}
          />
          <span>
            {getAbbreviatedNumber(tranche.total_removed)} of (
            {getAbbreviatedNumber(tranche.total_added)})
          </span>
        </div>
      </div>
      <BulletHeader tag="h2">{t("Users")}</BulletHeader>
      {tranche.users.length ? (
        <ul className="tranche__user-list">
          {tranche.users.map((user, i) => {
            return (
              <li className="tranche__user-item" key={i}>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={"https://etherscan.io/address/" + user.address}
                >
                  {user.address}
                </a>
                <div className="tranche__user-info">
                  <span>{user.total_tokens.toString()} VEGA</span>
                  <span>
                    {user.withdrawn_tokens.toString()} {t("Redeemed")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{t("No users")}</p>
      )}
    </>
  );
};
