import "./claim-flow.scss";
import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useVegaClaim } from "../../hooks/use-vega-claim";
import {
  ClaimAction,
  ClaimActionType,
  ClaimState,
  ClaimStatus,
} from "./claim-reducer";
import { CodeUsed } from "./code-used";
import { Expired } from "./expired";
import { TargetedClaim } from "./targeted-claim";
import { UntargetedClaim } from "./untargeted-claim";
import * as Sentry from "@sentry/react";
import { ClaimInfo } from "./claim-info";
import { TargetAddressMismatch } from "./target-address-mismatch";
import { TrancheNotFound } from "./tranche-not-found";
import { Verifying } from "./verifying";
import { truncateMiddle } from "../../lib/truncate-middle";
import { Complete } from "./complete";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { Tranche } from "../../lib/vega-web3/vega-web3-types";
import { formatNumber } from "../../lib/format-number";
import { UNSPENT_CODE } from "../../lib/vega-web3/vega-claim";

interface ClaimFlowProps {
  state: ClaimState;
  dispatch: React.Dispatch<ClaimAction>;
  address: string;
  tranches: Tranche[];
}

export const ClaimFlow = ({
  state,
  dispatch,
  address,
  tranches,
}: ClaimFlowProps) => {
  const { t } = useTranslation();
  const currentTranche = tranches.find(
    (tranche) => tranche.tranche_id === state.claimData?.claim.tranche
  );
  const claim = useVegaClaim();
  const code = state.claimData?.signature.s!;
  const shortCode = truncateMiddle(code);

  // Check that the claim is valid, by checking if its already committed, expired, or used
  React.useEffect(() => {
    const run = async () => {
      dispatch({ type: ClaimActionType.SET_LOADING, loading: true });
      try {
        const [committed, expired, used] = await Promise.all([
          claim.isCommitted({
            s: code,
            account: address,
          }),
          claim.isExpired(state.claimData?.claim.expiry!),
          claim.isUsed(code!),
        ]);
        console.log(committed, expired, used);
        dispatch({
          type: ClaimActionType.SET_INITIAL_CLAIM_STATUS,
          committed: committed !== UNSPENT_CODE,
          expired,
          used,
        });
      } catch (e) {
        Sentry.captureException(e);
        dispatch({
          type: ClaimActionType.ERROR,
          error: e,
        });
      } finally {
        dispatch({ type: ClaimActionType.SET_LOADING, loading: false });
      }
    };
    run();
  }, [address, claim, code, dispatch, state.claimData?.claim.expiry]);

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
        address={address}
        balanceFormatted={state.claimData?.claim.amount!}
        commitTxHash={state.commitTxHash}
        claimTxHash={state.claimTxHash}
      />
    );
  }

  if (
    state.claimData?.claim.target &&
    state.claimData?.claim.target.toLowerCase() !== address.toLowerCase()
  ) {
    return (
      <TargetAddressMismatch
        connectedAddress={address}
        expectedAddress={state.claimData.claim.target}
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
                  user: state.claimData?.claim.target
                    ? truncateMiddle(state.claimData?.claim.target)
                    : t("the holder"),
                  code: shortCode,
                  amount: state.claimData?.claim.amount,
                  linkText: `${t("Tranche")} ${currentTranche.tranche_id}`,
                  expiry: state.claimData?.claim.expiry
                    ? t("claimExpiry", {
                        date: format(
                          state.claimData?.claim.expiry * 1000,
                          "dd/MM/yyyy"
                        ),
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
            <KeyValueTable>
              <KeyValueTableRow>
                <th>{t("Connected Ethereum address")}</th>
                <td>{truncateMiddle(address)}</td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>{t("Amount of VEGA")}</th>
                <td>{formatNumber(state.claimData?.claim.amount!)}</td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>{t("Claim expires")}</th>
                <td>
                  {state.claimData?.claim.expiry
                    ? format(state.claimData?.claim.expiry * 1000, "dd/MM/yyyy")
                    : "No expiry"}
                </td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>{t("Starts unlocking")}</th>
                <td>{format(currentTranche.tranche_start, "dd/MM/yyyy")}</td>
              </KeyValueTableRow>
              <KeyValueTableRow>
                <th>{t("Fully unlocked")}</th>
                <td>{format(currentTranche.tranche_end, "dd/MM/yyyy")}</td>
              </KeyValueTableRow>
            </KeyValueTable>
          </div>
        </div>
      </section>
      <section>
        {/* If targeted we do not need to commit reveal, as there is no change of front running the mem pool */}
        {state.claimData?.claim.target ? (
          <TargetedClaim
            address={address}
            claimData={state.claimData}
            state={state}
            dispatch={dispatch}
          />
        ) : (
          state.claimData && (
            <UntargetedClaim
              address={address}
              committed={state.claimStatus === ClaimStatus.Committed}
              claimData={state.claimData}
              state={state}
              dispatch={dispatch}
            />
          )
        )}
      </section>
    </>
  );
};
