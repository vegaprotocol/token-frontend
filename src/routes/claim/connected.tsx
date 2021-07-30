import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
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

  return (
    <section>
      {
        <p>
          {t("Connected to Ethereum key {address}", {
            address: appState.address,
          })}
        </p>
      }
      <p>
        {t("claim", {
          user: state.target ? state.target : "the holder",
          code: shortCode,
          amount: state.denomination,
          trancheName: state.trancheId,
          unlockDate: format(
            new Date(currentTranche.tranche_end).getTime(),
            "MMM d, yyyy"
          ),
          trancheEndDate: format(
            new Date(currentTranche.tranche_start).getTime(),
            "MMM d, yyyy"
          ),
        })}
        {showRedeem ? t("showRedeem") : null}
      </p>
      {state.target && state.target !== address && (
        <p>
          <span style={{ color: "#ED1515" }}>{t("Warning")}: </span>
          {t(
            "You can use your connected key to claim the Tokens but it will credit {{target}} instead of {{address}}",
            {
              address,
              target: state.target,
            }
          )}
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
