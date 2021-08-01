import detectEthereumProvider from "@metamask/detect-provider";
import { format } from "date-fns";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Web3 from "web3";
import { Loading } from "../../components/loading";
import { useAppState } from "../../contexts/app-state/app-state-context";
import VegaClaim from "../../lib/vega-claim";
import { ClaimAction, ClaimState } from "./claim-reducer";
import { CodeUsed } from "./code-used";
import { Expired } from "./expired";
import { TargetedClaim } from "./targeted-claim";
import { UntargetedClaim } from "./untargeted-claim";

interface ConnectedClaimProps {
  state: ClaimState;
  dispatch: (action: ClaimAction) => void;
}

export const ConnectedClaim = ({ state, dispatch }: ConnectedClaimProps) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [committed, setCommitted] = React.useState<boolean>(false);
  const [expired, setExpired] = React.useState<boolean>(false);
  const [used, setUsed] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const { appState } = useAppState();
  const { address, tranches } = appState;
  const showRedeem = ["1", "true"].includes(process.env.REACT_APP_REDEEM_LIVE!);
  const code = state.code!;
  const shortCode =
    code.slice(0, 6) + "..." + code.slice(code.length - 4, code.length);
  React.useEffect(() => {
    /** Validate code */
    const run = async () => {
      const provider = (await detectEthereumProvider()) as any;
      const web3 = new Web3(provider);
      const claim = new VegaClaim(
        web3,
        "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21"
      );

      const { nonce, expiry, code } = state;
      const account = appState.address!;
      try {
        const [committed, expired, used] = await Promise.all([
          claim.isCommitted({
            claimCode: code!,
            account,
          }),
          claim.isExpired(expiry!),
          claim.isUsed(nonce!),
        ]);
        setCommitted(committed);
        setExpired(expired);
        setUsed(used);
        const hash = claim.deriveCommitment(code!, account);
        console.log(committed);
        console.log(hash);
      } catch (e) {
        // TODO should this report to sentry?
        console.log(e);
        dispatch({
          type: "ERROR",
          error: e,
        });
      } finally {
        setLoading(false);
      }
    };
    run();
    // HACK
    // Force only running once
    // TODO fix this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTranche = React.useMemo(() => {
    return tranches.find(
      ({ tranche_id }) => Number(tranche_id) === state.trancheId
    );
  }, [state.trancheId, tranches]);
  if (loading) {
    return <Loading />;
  } else if (used) {
    return <CodeUsed address={appState.address} />;
  } else if (expired) {
    return <Expired address={appState.address} code={shortCode} />;
  }
  if (!currentTranche) {
    throw new Error("Could not find tranche");
  }

  const unlockDate = format(
    new Date(currentTranche.tranche_end).getTime(),
    "MMM d, yyyy"
  );
  const trancheEndDate = format(
    new Date(currentTranche.tranche_start).getTime(),
    "MMM d, yyyy"
  );
  const fullyRedeemable =
    new Date().getTime() > new Date(currentTranche.tranche_end).getTime();
  const partiallyRedeemable =
    !fullyRedeemable &&
    new Date().getTime() > new Date(currentTranche.tranche_start).getTime();
  const noneRedeemable = !fullyRedeemable && !partiallyRedeemable;
  return (
    <section>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address: appState.address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <p>
        <Trans
          i18nKey="claim1"
          values={{
            user: state.target ? state.target : "the holder",
            code: shortCode,
            amount: state.denomination,
          }}
          components={{ bold: <strong /> }}
        />
        <Link
          to={`/tranches/${currentTranche.tranche_id}`}
          style={{ color: "#edff22" }}
        >
          {t("Tranche")} {currentTranche.tranche_id}
        </Link>{" "}
        {t("claim2", {
          expiry: "12/12/12", // TODO correct date.
        })}
      </p>
      {noneRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("none redeemable")}
        </p>
      )}
      {partiallyRedeemable && (
        <p>
          {t("tranche description", {
            unlockDate,
            trancheEndDate,
          })}{" "}
          {showRedeem && t("partially redeemable")}
        </p>
      )}
      {fullyRedeemable && (
        <p>
          {t("Tokens in this tranche are fully unlocked.")}
          {showRedeem && t("fully redeemable")}
        </p>
      )}
      {state.target && state.target !== address && (
        <p>
          <span style={{ color: "#ED1515" }}>{t("Warning")}: </span>
          <Trans
            i18nKey="You can use your connected key to claim the Tokens but it will credit {{target}} instead of {{address}}"
            values={{
              address,
              target: state.target,
            }}
            components={{ bold: <strong /> }}
          />
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
          <TargetedClaim
            claimCode={state.code!}
            denomination={state.denomination!}
            expiry={state.expiry!}
            nonce={state.nonce!}
            trancheId={state.trancheId!}
            country={"GB"} // TODO
            targeted={!!state.target}
            account={appState.address!}
          />
        ) : (
          <UntargetedClaim
            claimCode={state.code!}
            denomination={state.denomination!}
            expiry={state.expiry!}
            nonce={state.nonce!}
            trancheId={state.trancheId!}
            country={"GB"} // TODO
            targeted={!!state.target}
            account={appState.address!}
            committed={committed}
          />
        )}
      </div>
    </section>
  );
};
