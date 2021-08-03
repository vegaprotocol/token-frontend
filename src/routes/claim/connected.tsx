import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaClaim } from "../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "./claim-reducer";
import { CodeUsed } from "./code-used";
import { Expired } from "./expired";
import { TargetedClaim } from "./targeted-claim";
import { UntargetedClaim } from "./untargeted-claim";
import * as Sentry from "@sentry/react";
import { RedeemInfo } from "./redeem-info";

interface ConnectedClaimProps {
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const ConnectedClaim = ({ state, dispatch }: ConnectedClaimProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const claim = useVegaClaim();
  const { address, tranches } = appState;
  const code = state.code!;
  const shortCode =
    code.slice(0, 6) + "..." + code.slice(code.length - 4, code.length);

  React.useEffect(() => {
    const run = async () => {
      const account = appState.address!;
      try {
        const [committed, expired, used] = await Promise.all([
          claim.isCommitted({
            claimCode: code,
            account,
          }),
          claim.isExpired(state.expiry!),
          claim.isUsed(state.nonce!),
        ]);
        dispatch({
          type: "SET_INITIAL_CLAIM_STATUS",
          committed,
          expired,
          used,
        });
      } catch (e) {
        Sentry.captureEvent(e);
        dispatch({
          type: "ERROR",
          error: e,
        });
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    };
    run();
  }, [appState.address, claim, dispatch, state.nonce, state.expiry, code]);

  const currentTranche = React.useMemo(() => {
    return tranches.find(
      ({ tranche_id }) => Number(tranche_id) === state.trancheId
    );
  }, [state.trancheId, tranches]);

  if (state.loading) {
    return <Loading />;
  } else if (state.claimStatus === ClaimStatus.Used) {
    return <CodeUsed address={appState.address} />;
  } else if (state.claimStatus === ClaimStatus.Expired) {
    return <Expired address={appState.address} code={shortCode} />;
  }
  if (!currentTranche) {
    throw new Error("Could not find tranche");
  }

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
          i18nKey="claim"
          values={{
            user: state.target ? state.target : "the holder",
            code: shortCode,
            amount: state.denomination,
            linkText: `${t("Tranche")} ${currentTranche.tranche_id}`,
            expiry: state.expiry
              ? t("claimExpiry", {
                  date: format(state.expiry * 1000, "dd/MM/yyyy"),
                })
              : t("claimNoExpiry"),
          }}
          components={{
            bold: <strong />,
            trancheLink: (
              <Link
                to={`/tranches/${currentTranche.tranche_id}`}
                style={{ color: "#edff22" }}
              />
            ),
          }}
        />
      </p>
      <RedeemInfo tranche={currentTranche} />
      {state.target &&
        address &&
        state.target.toLowerCase() !== address.toLowerCase() && (
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
          <TargetedClaim
            claimCode={state.code!}
            denomination={state.denomination!}
            expiry={state.expiry!}
            nonce={state.nonce!}
            trancheId={state.trancheId!}
            targeted={!!state.target}
            account={appState.address!}
            state={state}
            dispatch={dispatch}
          />
        ) : (
          <UntargetedClaim
            claimCode={state.code!}
            denomination={state.denomination!}
            expiry={state.expiry!}
            nonce={state.nonce!}
            trancheId={state.trancheId!}
            targeted={!!state.target}
            account={appState.address!}
            committed={state.claimStatus === ClaimStatus.Committed}
            state={state}
            dispatch={dispatch}
          />
        )}
      </div>
    </section>
  );
};
