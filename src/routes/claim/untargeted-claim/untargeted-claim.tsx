import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { FormGroup } from "../../../components/form-group";
import { TxState } from "../../../hooks/transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { BigNumber } from "../../../lib/bignumber";
import { BulletHeader } from "../../../components/bullet-header";
import {
  ClaimAction,
  ClaimActionType,
  ClaimState,
  ClaimStatus,
} from "../claim-reducer";
import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";

interface UntargetedClaimProps {
  address: string;
  claimCode: string;
  denomination: BigNumber;
  denominationFormatted: BigNumber;
  trancheId: number;
  expiry: number;
  nonce: string;
  targeted: boolean;
  committed: boolean;
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const UntargetedClaim = ({
  address,
  claimCode,
  denomination,
  denominationFormatted,
  trancheId,
  expiry,
  nonce,
  targeted,
  committed,
  state,
  dispatch,
}: UntargetedClaimProps) => {
  const claim = useVegaClaim();

  const {
    state: commitState,
    dispatch: commitDispatch,
    perform: commitClaim,
  } = useTransaction(
    () => claim.commit(claimCode, address),
    () => claim.checkCommit(claimCode, address)
  );
  const claimArgs = {
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country: state.countryCode!,
    targeted,
    account: address,
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

  React.useEffect(() => {
    if (commitState.txData.hash) {
      dispatch({
        type: ClaimActionType.SET_COMMIT_TX_HASH,
        commitTxHash: commitState.txData.hash,
      });
    }
  }, [commitState.txData.hash, dispatch]);

  React.useEffect(() => {
    if (revealState.txData.hash) {
      dispatch({
        type: ClaimActionType.SET_CLAIM_TX_HASH,
        claimTxHash: revealState.txData.hash,
      });
    }
  }, [revealState.txData.hash, dispatch]);

  React.useEffect(() => {
    if (revealState.txState === TxState.Complete) {
      setTimeout(() => {
        dispatch({
          type: ClaimActionType.SET_CLAIM_STATUS,
          status: ClaimStatus.Finished,
        });
      }, 2000);
    }
  }, [revealState.txState, dispatch]);

  return (
    <div style={{ maxWidth: 480 }}>
      <BulletHeader tag="h2">
        {t("Step")} 1. {t("Select country")}
      </BulletHeader>
      <FormGroup
        label={t("Select your country or region of current residence")}
        labelFor="country-selector"
      >
        <CountrySelector
          code={state.countryCode}
          onSelectCountry={(countryCode) =>
            dispatch({ type: ClaimActionType.SET_COUNTRY, countryCode })
          }
        />
      </FormGroup>
      <BulletHeader tag="h2">
        {t("Step")} 2. {t("commitTitle")}
      </BulletHeader>
      {state.countryCode ? (
        <ClaimStep1
          countryCode={state.countryCode}
          txState={commitState}
          txDispatch={commitDispatch}
          completed={committed}
          onSubmit={commitClaim}
        />
      ) : (
        <p className="text-muted">{t("selectCountryPrompt")}</p>
      )}
      <BulletHeader tag="h2">
        {t("Step")} 3. {t("Claim tokens")}
      </BulletHeader>
      {committed || commitState.txState === TxState.Complete ? (
        <ClaimStep2
          txState={revealState}
          txDispatch={revealDispatch}
          amount={denominationFormatted}
          onSubmit={commitReveal}
        />
      ) : (
        <p className="text-muted">{t("claimNotReady")}</p>
      )}
    </div>
  );
};
