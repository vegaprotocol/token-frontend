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
import { CountrySelector } from "../../components/country-selector";
import { useValidateCountry } from "./hooks";
import { LockedBanner } from "./locked-banner";
import { useTranche } from "../../hooks/use-tranches";
import { TrancheNotFound } from "./tranche-not-found";
import { Verifying } from "./verifying";
import { FormGroup } from "../../components/form-group";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Callout } from "../../components/callout";
import { Tick } from "../../components/icons";

interface ClaimFlowProps {
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
}

export const ClaimFlow = ({ state, dispatch }: ClaimFlowProps) => {
  const { t } = useTranslation();
  const { country, checkCountry, isValid, loading } =
    useValidateCountry(dispatch);

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
  } else if (state.loading) {
    return <Verifying />;
  } else if (state.claimStatus === ClaimStatus.Used) {
    return <CodeUsed address={address} />;
  } else if (state.claimStatus === ClaimStatus.Expired) {
    return <Expired address={address} code={shortCode} />;
  } else if (
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
    <section>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address }}
          components={{ bold: <strong /> }}
        />
      </p>
      {state.claimStatus === ClaimStatus.Finished && (
        <Callout intent="success" title="Claim complete" icon={<Tick />}>
          <p>
            Ethereum address {address} now has a vested right to{" "}
            {balance?.toString()} VEGA tokens from{" "}
            <Link to={`/tranches/${currentTranche.tranche_id}`}>
              tranche {currentTranche.tranche_id}
            </Link>{" "}
            of the vesting contract.
          </p>
        </Callout>
      )}
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
      <ClaimInfo tranche={currentTranche} />

      {state.claimStatus === ClaimStatus.Finished ? (
        <LockedBanner />
      ) : (
        <>
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
          <div
            style={{
              display: "grid",
              gap: 30,
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                account={address!}
                state={state}
                dispatch={dispatch}
                isValid={isValid}
                loading={loading}
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
                isValid={isValid}
                loading={loading}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
};
