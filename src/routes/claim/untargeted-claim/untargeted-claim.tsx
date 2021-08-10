import React from "react";
import { useTranslation } from "react-i18next";
import { CountrySelector } from "../../../components/country-selector";
import { FormGroup } from "../../../components/form-group";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaClaim } from "../../../hooks/use-vega-claim";
import { BigNumber } from "../../../lib/bignumber";
import { BulletHeader } from "../../tranches/bullet-header";
import { ClaimAction, ClaimState, ClaimStatus } from "../claim-reducer";
import { ClaimStep1 } from "../claim-step-1";
import { ClaimStep2 } from "../claim-step-2";

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

  React.useEffect(() => {
    if (revealState.txState === TxState.Complete) {
      setTimeout(() => {
        dispatch({ type: "SET_CLAIM_STATUS", status: ClaimStatus.Finished });
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
          onSelectCountry={(countryCode) =>
            dispatch({ type: "SET_COUNTRY", countryCode })
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
          amount={denomination}
          onSubmit={commitReveal}
          step1Completed={committed || commitState.txState === TxState.Complete}
        />
      ) : (
        <p className="text-muted">{t("claimNotReady")}</p>
      )}
    </div>
  );
};
