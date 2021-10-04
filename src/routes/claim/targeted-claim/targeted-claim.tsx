import React from "react";
import { TxState } from "../../../hooks/transaction-reducer";
import {
  ClaimAction,
  ClaimActionType,
  ClaimState,
  ClaimStatus,
} from "../claim-reducer";
import { FormGroup } from "../../../components/form-group";
import { CountrySelector } from "../../../components/country-selector";
import { useTranslation } from "react-i18next";
import { ClaimForm } from "../claim-form";
import { BulletHeader } from "../../../components/bullet-header";
import { IClaimTokenParams } from "../../../lib/vega-web3/vega-web3-types";
import { useClaim } from "../hooks";

interface TargetedClaimProps {
  address: string;
  claimData: IClaimTokenParams;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const TargetedClaim = ({
  address,
  claimData,
  state,
  dispatch,
}: TargetedClaimProps) => {
  const { t } = useTranslation();
  const {
    state: txState,
    dispatch: txDispatch,
    perform: claimTargeted,
  } = useClaim(claimData, address);

  React.useEffect(() => {
    if (txState.txData.hash) {
      dispatch({
        type: ClaimActionType.SET_CLAIM_TX_HASH,
        claimTxHash: txState.txData.hash,
      });
    }
  }, [txState.txData.hash, dispatch]);

  React.useEffect(() => {
    if (txState.txState === TxState.Complete) {
      setTimeout(() => {
        dispatch({
          type: ClaimActionType.SET_CLAIM_STATUS,
          status: ClaimStatus.Finished,
        });
      }, 2000);
    }
  }, [txState.txState, dispatch]);
  return (
    <div style={{ maxWidth: 480 }} data-testid="targeted-claim">
      <BulletHeader tag="h2">
        {t("Step")} 1. {t("Select country")}
      </BulletHeader>
      <FormGroup
        label={t("Select your country or region of current residence")}
        labelFor="country-selector"
      >
        <CountrySelector
          code={state.claimData?.country!}
          onSelectCountry={(countryCode) =>
            dispatch({ type: ClaimActionType.SET_COUNTRY, countryCode })
          }
        />
      </FormGroup>
      <BulletHeader tag="h2">
        {t("Step")} 2. {t("Claim tokens")}
      </BulletHeader>
      {state.claimData?.country! ? (
        <ClaimForm
          countryCode={state.claimData?.country!}
          txState={txState}
          txDispatch={txDispatch}
          onSubmit={claimTargeted}
        />
      ) : (
        <p className="text-muted">{t("selectCountryPrompt")}</p>
      )}
    </div>
  );
};
