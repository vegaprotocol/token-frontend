import React from "react";
import { useTranslation } from "react-i18next";
import { ConnectedVegaKey } from "../../components/connected-vega-key";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../components/staking-method-radio";
import { useSearchParams } from "../../hooks/use-search-params";

export const DisassociatePage = () => {
  const { t } = useTranslation();
  const params = useSearchParams();

  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  return (
    <section data-testid="disassociate-page">
      <p>
        {t(
          "Use this form to disassociate VEGA tokens with a Vega key. This returns them to either the Ethereum wallet that used the Staking bridge or the vesting contract."
        )}
      </p>
      <p>
        <span>{t("Warning")}:</span>{" "}
        {t(
          "Any Tokens that have been nominated to a node will sacrifice any Rewards they are due for the current epoch. If you do not wish to sacrifices fees you should remove stake from a node at the end of an epoch before disassocation."
        )}
      </p>
      <h1>{t("What Vega wallet are you removing Tokens from?")}</h1>
      <ConnectedVegaKey pubKey="foo" />
      <h1>{t("What tokens would you like to return?")}</h1>
      <StakingMethodRadio
        setSelectedStakingMethod={setSelectedStakingMethod}
        selectedStakingMethod={selectedStakingMethod}
      />
    </section>
  );
};
