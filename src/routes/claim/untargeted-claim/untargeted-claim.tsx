import React from "react";
import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";
import { BigNumber } from "../../../lib/bignumber";
import { FormGroup } from "../../../components/form-group";
import { useTranslation } from "react-i18next";
import { useValidateCountry } from "../hooks";
import { CountrySelector } from "../../../components/country-selector";

interface UntargetedClaimProps {
  claimCode: string;
  denomination: BigNumber;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  committed: boolean;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const UntargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
  committed,
  state,
  dispatch,
}: UntargetedClaimProps) => {
  const { appState } = useAppState();
  const claim = useVegaClaim();

  const {
    state: commitState,
    dispatch: commitDispatch,
    perform: commitClaim,
  } = useTransaction(
    () => claim.commit(claimCode, appState.address!),
    () => claim.checkCommit(claimCode, appState.address!)
  );
  const claimArgs = {
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country: state.countryCode!,
    targeted,
    account,
  };
  const {
    state: revealState,
    dispatch: revealDispatch,
    perform: commitReveal,
  } = useTransaction(
    () => claim.claim(claimArgs),
    () => claim.checkClaim(claimArgs)
  );
  const { t } = useTranslation();
  const { country, checkCountry, isValid, loading } =
    useValidateCountry(dispatch);

  React.useEffect(() => {
    if (revealState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Finished });
    }
  }, [revealState.txState, dispatch]);

  return (
    <div
      style={{
        display: "grid",
        gap: "0 20px",
        gridTemplateRows: "min-content min-content",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <div>
        <FormGroup
          label={t("Select your country or region of current residence")}
          labelFor="country-selector"
          errorText={
            !isValid && country?.code
              ? t(
                  "Sorry. It is not possible to claim tokens in your country or region."
                )
              : undefined
          }
        >
          <CountrySelector setCountry={checkCountry} />
        </FormGroup>
      </div>
      <div style={{ gridRow: "2/3" }}>
        <ClaimStep1
          loading={loading}
          isValid={isValid}
          txState={commitState}
          txDispatch={commitDispatch}
          completed={committed}
          onSubmit={commitClaim}
        />
      </div>
      <div style={{ gridRow: "2/3" }}>
        <ClaimStep2
          loading={loading}
          isValid={isValid}
          txState={revealState}
          txDispatch={revealDispatch}
          amount={denomination}
          onSubmit={commitReveal}
          step1Completed={committed || commitState.txState === TxState.Complete}
        />
      </div>
    </div>
  );
};
