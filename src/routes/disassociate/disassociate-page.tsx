import "./disassociate-page.scss";
import BigNumber from "bignumber.js";
import React from "react";
import { useTranslation } from "react-i18next";
import { ConnectedVegaKey } from "../../components/connected-vega-key";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../components/staking-method-radio";
import { TokenInput } from "../../components/token-input";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";

export const DisassociatePage = ({
  address,
  vegaKey,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
}) => {
  // TODO
  const maximum = new BigNumber("1");
  const [amount, setAmount] = React.useState("");
  const isDisabled = true;
  const perform = () => undefined;

  // Done
  const { t } = useTranslation();
  const params = useSearchParams();

  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  return (
    <section className="disassociate-page" data-testid="disassociate-page">
      <p>
        {t(
          "Use this form to disassociate VEGA tokens with a Vega key. This returns them to either the Ethereum wallet that used the Staking bridge or the vesting contract."
        )}
      </p>
      <p>
        <span className="disassociate-page__error">{t("Warning")}:</span>{" "}
        {t(
          "Any Tokens that have been nominated to a node will sacrifice any Rewards they are due for the current epoch. If you do not wish to sacrifices fees you should remove stake from a node at the end of an epoch before disassocation."
        )}
      </p>
      <h1>{t("What Vega wallet are you removing Tokens from?")}</h1>
      <ConnectedVegaKey pubKey={vegaKey.pub} />
      <h1>{t("What tokens would you like to return?")}</h1>
      <StakingMethodRadio
        setSelectedStakingMethod={setSelectedStakingMethod}
        selectedStakingMethod={selectedStakingMethod}
      />
      {selectedStakingMethod ? (
        <>
          <TokenInput maximum={maximum} amount={amount} setAmount={setAmount} />
          <button
            style={{ marginTop: 10, width: "100%" }}
            data-testid="associate-button"
            disabled={isDisabled}
            onClick={perform}
          >
            {t("Disassociate VEGA Tokens from key")}
          </button>
        </>
      ) : null}
    </section>
  );
};
