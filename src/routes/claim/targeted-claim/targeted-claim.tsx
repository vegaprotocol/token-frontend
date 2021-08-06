import React from "react";
import { useTransaction } from "../../../hooks/use-transaction";
import { TxState } from "../../../hooks/transaction-reducer";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";
import { BigNumber } from "../../../lib/bignumber";
import { FormGroup } from "../../../components/form-group";
import { CountrySelector } from "../../../components/country-selector";
import { ContinueButton } from "../../../components/continue-button";
import { useTranslation } from "react-i18next";
import { TransactionCallout } from "../../../components/transaction-callout";
import { useValidateCountry } from "../hooks";
import { ClaimForm } from "../claim-form";

interface TargetedClaimProps {
  claimCode: string;
  denomination: BigNumber;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  account: string;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const TargetedClaim = ({
  claimCode,
  denomination,
  trancheId,
  expiry,
  nonce,
  targeted,
  account,
  state,
  dispatch,
}: TargetedClaimProps) => {
  const { t } = useTranslation();
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
  const claim = useVegaClaim();
  const {
    state: txState,
    dispatch: txDispatch,
    perform: claimTargeted,
  } = useTransaction(
    () => claim.claim(claimArgs),
    () => claim.checkClaim(claimArgs)
  );
  const { country, checkCountry, isValid, loading } =
    useValidateCountry(dispatch);

  React.useEffect(() => {
    if (txState.txState === TxState.Complete) {
      dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Finished });
    }
  }, [txState.txState, dispatch]);

  if (txState.txState !== TxState.Default) {
    return (
      <TransactionCallout
        state={txState}
        reset={() => txDispatch({ type: "TX_RESET" })}
      />
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 600 }}>
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
      <ClaimForm
        isValid={isValid}
        loading={loading}
        txState={txState}
        txDispatch={txDispatch}
        onSubmit={claimTargeted}
      />
    </form>
  );
};
