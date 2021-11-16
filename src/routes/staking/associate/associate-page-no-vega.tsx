import React from "react";
import { useTranslation } from "react-i18next";
import { ContractAssociate } from "./contract-associate";
import { useAppState } from "../../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../../hooks/use-search-params";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../../components/staking-method-radio";
import { ConnectToVega } from "../connect-to-vega";

export const AssociatePageNoVega = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [amount, setAmount] = React.useState<string>("");
  const vegaKey = null;

  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);

  const {
    appState: { totalVestedBalance },
  } = useAppState();

  const zeroVesting = totalVestedBalance.isEqualTo(0);
  return (
    <section data-testid="associate">
      <p data-testid="associate-information">
        {t(
          "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
        )}
      </p>
      {zeroVesting ? null : (
        <>
          <h2 data-testid="associate-subheader">
            {t("Where would you like to stake from?")}
          </h2>
          <StakingMethodRadio
            setSelectedStakingMethod={setSelectedStakingMethod}
            selectedStakingMethod={selectedStakingMethod}
          />
        </>
      )}
      {selectedStakingMethod &&
        (selectedStakingMethod === StakingMethod.Contract ? (
          <ContractAssociate
            vegaKey={vegaKey}
            perform={() => {}}
            amount={amount}
            setAmount={setAmount}
          />
        ) : (
          <ConnectToVega />
        ))}
      {!vegaKey ? <ConnectToVega /> : null}
    </section>
  );
};
