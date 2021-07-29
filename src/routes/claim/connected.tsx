import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { ClaimState, TxState } from "./claim-reducer";

interface ConnectedClaimProps {
  state: ClaimState;
  commitClaim: () => void;
}

export const ConnectedClaim = ({ state, commitClaim }: ConnectedClaimProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { address, tranches } = appState;
  const showRedeem = false; // TODO needs to be false until we build this
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
          {t("Warning", {
            address,
            target: state.target,
          })}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          height: 200,
          borderTop: "1px solid white",
          paddingTop: 15,
        }}
      >
        <div style={{ padding: 15 }}>
          <h1>{t("step1Title")}</h1>
          <p>{t("step1Body")}</p>
          <ClaimForm state={state} onSubmit={() => commitClaim()} />
        </div>
        <div style={{ padding: 15 }}>
          <h1>{t("step2Title")}</h1>
          <p>{t("step2Body")}</p>
          <p>{t("step2Note")}</p>
        </div>
      </div>
    </section>
  );
};

const ClaimForm = ({
  state,
  onSubmit,
}: {
  state: ClaimState;
  onSubmit: () => void;
}) => {
  const { t } = useTranslation();

  if (state.claimTxState === TxState.Error) {
    return <div>{state.claimTxData.error?.message || "Unknown error"}</div>;
  }

  if (state.claimTxState === TxState.Pending) {
    return (
      <div>
        Transaction in progress.{" "}
        <a href={`https://etherscan.io/tx/${state.claimTxData.hash}`}>
          View on Etherscan
        </a>
      </div>
    );
  }

  if (state.claimTxState === TxState.Requested) {
    return <div>Please confirm transaction in your connected wallet</div>;
  }

  if (state.claimTxState === TxState.Complete) {
    return <div>Complete</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <fieldset>
        <select>
          <option>{t("Please select your country")}</option>
          <option>Earth</option>
        </select>
      </fieldset>
      <button>{t("Continue")}</button>
    </form>
  );
};
