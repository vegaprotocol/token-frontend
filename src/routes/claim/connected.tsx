import React from "react";
import { useTranslation } from "react-i18next";
import { Countries } from "../../components/countries";
import { ClaimState, TxState } from "./claim-reducer";

interface ConnectedClaimProps {
  state: ClaimState;
  commitClaim: () => void;
}

export const ConnectedClaim = ({ state, commitClaim }: ConnectedClaimProps) => {
  const { t } = useTranslation();

  const code = "0xf780...d296Cb";
  const trancheName = "tranch 2";
  const showRedeem = false; // TODO needs to be false until we build this
  const trancheEndDate = "June 5 2023";
  const unlockDate = "5th March 2022";
  const pubkey = "0x" + "0".repeat(40);
  const amount = 200;
  return (
    <section>
      <p>
        {t("claim", {
          user: pubkey ? pubkey : "the holder",
          code,
          amount,
          trancheName,
          unlockDate,
          trancheEndDate,
        })}

        {showRedeem ? t("showRedeem") : null}
      </p>
      <div
        style={{
          display: "grid",
          height: 200,
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid white",
          paddingTop: 15,
        }}
      >
        <div style={{ padding: 15, borderRight: "1px solid white" }}>
          <h1>{t("step1Title")}</h1>
          <p>{t("step1Body")}</p>
          <ClaimForm state={state} onSubmit={() => commitClaim()} />
        </div>
        <div style={{ padding: 15 }}>
          <h1>{t("step2Title")}</h1>
          <p>{t("step2body")}</p>
          <p>{t("step2note")}</p>
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
  const [isValidCountry, setIsValidCountry] = React.useState(false)
  const countryValidator = (isValid: boolean) => {
    setIsValidCountry(isValid)
  }
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
        <Countries setIsValidCountry={countryValidator}/>
      </fieldset>
      <fieldset>
        <input type="checkbox"></input>
        <label>{t("I accept the Terms and Conditions")}</label>
      </fieldset>
      <button disabled={!isValidCountry}>{t("Continue")}</button>
    </form>
  );
};
