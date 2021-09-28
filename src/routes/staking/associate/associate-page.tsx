import React from "react";
import { useTranslation } from "react-i18next";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import { VegaKeyExtended } from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { AssociateTransaction } from "./associate-transaction";
import { useSearchParams } from "../../../hooks/use-search-params";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../../components/staking-method-radio";
import { useAddStake } from "./hooks";
import { StakingWalletsContainer } from "../staking-wallets-container";
import { useEthereumConfig } from "../../../hooks/use-ethereum-config";
import { BigNumber } from "../../../lib/bignumber";
import { useMinDelegation } from "../../../hooks/use-min-delegation";

export const NetworkParamsContainer = ({
  children,
}: {
  children: (data: {
    confirmations: number;
    minDelegation: BigNumber;
  }) => React.ReactElement;
}) => {
  const config = useEthereumConfig();
  const minDelegation = useMinDelegation();

  if (!config || !minDelegation) {
    return null;
  }

  return children({
    confirmations: config.confirmations,
    minDelegation,
  });
};

export const AssociateContainer = () => {
  return (
    <NetworkParamsContainer>
      {({ confirmations, minDelegation }) => (
        <StakingWalletsContainer>
          {({ address, currVegaKey }) => (
            <AssociatePage
              address={address}
              vegaKey={currVegaKey}
              requiredConfirmations={confirmations}
              minDelegation={minDelegation}
            />
          )}
        </StakingWalletsContainer>
      )}
    </NetworkParamsContainer>
  );
};

export const AssociatePage = ({
  address,
  vegaKey,
  requiredConfirmations,
  minDelegation,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
  requiredConfirmations: number;
  minDelegation: BigNumber;
}) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [amount, setAmount] = React.useState<string>("");

  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  const {
    state: txState,
    dispatch: txDispatch,
    perform: txPerform,
  } = useAddStake(
    address,
    amount,
    vegaKey.pub,
    selectedStakingMethod,
    requiredConfirmations
  );

  if (txState.txState !== TxState.Default) {
    return (
      <AssociateTransaction
        amount={amount}
        vegaKey={vegaKey.pub}
        state={txState}
        dispatch={txDispatch}
        requiredConfirmations={requiredConfirmations}
      />
    );
  }
  return (
    <section data-testid="associate">
      <p data-testid="associate-information">
        {t(
          "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
        )}
      </p>
      <h2 data-testid="associate-subheader">
        {t("Where would you like to stake from?")}
      </h2>
      <StakingMethodRadio
        setSelectedStakingMethod={setSelectedStakingMethod}
        selectedStakingMethod={selectedStakingMethod}
      />
      {selectedStakingMethod &&
        (selectedStakingMethod === StakingMethod.Contract ? (
          <ContractAssociate
            vegaKey={vegaKey}
            perform={txPerform}
            amount={amount}
            setAmount={setAmount}
            minDelegation={minDelegation}
          />
        ) : (
          <WalletAssociate
            address={address}
            vegaKey={vegaKey}
            perform={txPerform}
            amount={amount}
            setAmount={setAmount}
            minDelegation={minDelegation}
          />
        ))}
    </section>
  );
};
