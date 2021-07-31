import detectEthereumProvider from "@metamask/detect-provider";
import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Web3 from "web3";
import { Loading } from "../../components/loading";
import { useAppState } from "../../contexts/app-state/app-state-context";
import VegaClaim from "../../lib/vega-claim";
import { ClaimAction, ClaimState, TxState } from "./claim-form/claim-reducer";
import { ClaimStep1 } from "./claim-step-1";
import { ClaimStep2 } from "./claim-step-2";
import { TargetedClaim } from "./targeted-claim";

interface ConnectedClaimProps {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
}

export const ConnectedClaim = ({ state, dispatch }: ConnectedClaimProps) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { address, tranches } = appState;
  const showRedeem = ["1", "true"].includes(process.env.REACT_APP_REDEEM_LIVE!);
  const code = state.code!;

  React.useEffect(() => {
    /** Validate code */
    const run = async () => {
      const provider = (await detectEthereumProvider()) as any;
      const web3 = new Web3(provider);
      const claim = new VegaClaim(
        web3,
        "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
      );
      const { nonce, expiry, code } = state;
      const account = appState.address!;
      let valid = false;
      try {
        valid = await claim.isClaimValid({
          nonce: nonce!,
          claimCode: code!,
          expiry: expiry!,
          account,
        });
      } catch (e) {
        // TODO should this report to sentry?
        console.log(e);
        dispatch({
          type: "ERROR",
          error: e,
        });
      } finally {
        setLoading(false);
      }

      if (!valid) {
        dispatch({
          type: "ERROR",
          error: new Error("Invalid code"),
        });
      }
    };
    run();
    // HACK
    // Force only running once
    // TODO fix this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTranche = React.useMemo(() => {
    return tranches.find(
      ({ tranche_id }) => Number(tranche_id) === state.trancheId
    );
  }, [state.trancheId, tranches]);
  if (loading) {
    return <Loading />;
  }
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
          <TargetedClaim state={state} dispatch={dispatch} />
        ) : (
          <>
            <ClaimStep1 state={state} dispatch={dispatch} />
            <ClaimStep2
              claimState={state}
              step1Completed={state.claimTxState === TxState.Complete}
              amount={state.denomination}
            />
          </>
        )}
      </div>
    </section>
  );
};
