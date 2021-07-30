import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { ClaimForm } from "./claim-form";
import { ClaimAction, ClaimState, TxState } from "./claim-form/claim-reducer";
import { ClaimStep2 } from "./claim-step-2";

interface ConnectedClaimProps {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
  commitClaim: () => void;
}

export const ConnectedClaim = ({
  state,
  commitClaim,
  dispatch,
}: ConnectedClaimProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { address, tranches } = appState;
  const showRedeem = ["1", "true"].includes(process.env.REACT_APP_REDEEM_LIVE!);
  const code = state.code!;
  const currentTranche = React.useMemo(() => {
    return tranches.find(
      ({ tranche_id }) => Number(tranche_id) === state.trancheId
    );
  }, [state.trancheId, tranches]);
  if (!currentTranche) {
    throw new Error("Could not find tranche");
  }
  const shortCode =
    code.slice(0, 6) + "..." + code.slice(code.length - 4, code.length);
  const unlockDate = format(
    new Date(currentTranche.tranche_end).getTime(),
    "MMM d, yyyy"
  );
  const trancheEndDate = format(
    new Date(currentTranche.tranche_start).getTime(),
    "MMM d, yyyy"
  );
  const fullyRedeemable =
    new Date().getTime() > new Date(currentTranche.tranche_end).getTime();
  const partiallyRedeemable =
    !fullyRedeemable &&
    new Date().getTime() > new Date(currentTranche.tranche_start).getTime();
  const noneRedeemable = !fullyRedeemable && !partiallyRedeemable;
  return (
    <section>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address: appState.address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="claim1"
          values={{
            user: state.target ? state.target : "the holder",
            code: shortCode,
            amount: state.denomination,
          }}
          components={{ bold: <strong /> }}
        />
        <Link
          to={`/tranches/${currentTranche.tranche_id}`}
          style={{ color: "#edff22" }}
        >
          {t("Tranche")} {currentTranche.tranche_id}
        </Link>{" "}
        {t("claim2", {
          expiry: "12/12/12", // TODO correct date.
        })}
      </p>
      {noneRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("none redeemable")}
        </p>
      )}
      {partiallyRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("partially redeemable")}
        </p>
      )}
      {fullyRedeemable && (
        <p>
          {t("Tokens in this tranche are fully unlocked.")}
          {showRedeem && t("fully redeemable")}
        </p>
      )}
      {state.target && state.target !== address && (
        <p>
          <span style={{ color: "#ED1515" }}>{t("Warning")}: </span>
          <Trans
            i18nKey="You can use your connected key to claim the Tokens but it will credit {{target}} instead of {{address}}"
            values={{
              address,
              target: state.target,
            }}
            components={{ bold: <strong /> }}
          />
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          borderTop: "1px solid white",
          paddingTop: 15,
        }}
      >
        {/* If targeted we do not need to commit reveal, as there is no change of front running the mem pool */}
        {state.target ? (
          <ClaimForm
            state={state}
            onSubmit={() => commitClaim()}
            dispatch={dispatch}
          />
        ) : (
          <>
            <div
              data-testid="claim-step-1"
              style={{ padding: 15, display: "flex", flexDirection: "column" }}
            >
              <h1>{t("step1Title")}</h1>
              <p>{t("step1Body")}</p>
              <ClaimForm
                state={state}
                onSubmit={() => commitClaim()}
                dispatch={dispatch}
              />
            </div>
            <ClaimStep2
              step1Completed={state.claimTxState === TxState.Complete}
              amount={state.denomination}
            />
          </>
        )}
      </div>
    </section>
  );
};
