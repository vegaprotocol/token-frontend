import "./claim-flow.scss";
import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaClaim } from "../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "./claim-reducer";
import { CodeUsed } from "./code-used";
import { Expired } from "./expired";
import { TargetedClaim } from "./targeted-claim";
import { UntargetedClaim } from "./untargeted-claim";
import * as Sentry from "@sentry/react";
import { ClaimInfo } from "./claim-info";
import { TargetAddressMismatch } from "./target-address-mismatch";
import { useTranche } from "../../hooks/use-tranches";
import { TrancheNotFound } from "./tranche-not-found";
import { Verifying } from "./verifying";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Complete } from "./complete";

interface ClaimFlowProps {
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const ClaimFlow = ({ state, dispatch }: ClaimFlowProps) => {
  const { t } = useTranslation();
  const {
    appState: { address, balance },
  } = useAppState();

  const currentTranche = useTranche(state.trancheId);
  const claim = useVegaClaim();
  const code = state.code!;
  const shortCode = truncateMiddle(code);

  React.useEffect(() => {
    const run = async () => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const [committed, expired, used] = await Promise.all([
          claim.isCommitted({
            claimCode: code,
            account: address!,
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
  }, [address, claim, dispatch, state.nonce, state.expiry, code]);

  if (!currentTranche) {
    return <TrancheNotFound />;
  }

  if (state.loading) {
    return <Verifying />;
  }

  if (state.claimStatus === ClaimStatus.Used) {
    return <CodeUsed address={address} />;
  }

  if (state.claimStatus === ClaimStatus.Expired) {
    return <Expired address={address} code={shortCode} />;
  }

  if (state.claimStatus === ClaimStatus.Finished) {
    return (
      <Complete
        address={address!}
        balance={balance!}
        trancheId={currentTranche.tranche_id}
      />
    );
  }

  if (
    state.target &&
    address &&
    state.target.toLowerCase() !== address.toLowerCase()
  ) {
    return (
      <TargetAddressMismatch
        connectedAddress={address}
        expectedAddress={state.target}
      />
    );
  }

  return (
    <>
      <section>
        <div className="claim-flow__grid">
          <div>
            <p>
              <Trans
                i18nKey="claim"
                values={{
                  user: state.target
                    ? truncateMiddle(state.target)
                    : "the holder",
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
                    <Link to={`/tranches/${currentTranche.tranche_id}`} />
                  ),
                }}
              />
            </p>
            <ClaimInfo tranche={currentTranche} />
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <th>Ethereum address</th>
                  <td>{truncateMiddle(address!)}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>{state.denomination?.toString()}</td>
                </tr>
                <tr>
                  <th>Claim expires</th>
                  <td>
                    {state.expiry
                      ? format(state.expiry * 1000, "dd/MM/yyyy")
                      : "No expiry"}
                  </td>
                </tr>
                <tr>
                  <th>Unlocks</th>
                  <td>{format(currentTranche.tranche_start, "dd/MM/yyyyy")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section>
        {/* If targeted we do not need to commit reveal, as there is no change of front running the mem pool */}
        {state.target ? (
          <TargetedClaim
            claimCode={state.code!}
            denomination={state.denomination!}
            expiry={state.expiry!}
            nonce={state.nonce!}
            trancheId={state.trancheId!}
            targeted={!!state.target}
            account={address!}
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
            account={address!}
            committed={state.claimStatus === ClaimStatus.Committed}
            state={state}
            dispatch={dispatch}
          />
        )}
      </section>
    </>
  );
};
