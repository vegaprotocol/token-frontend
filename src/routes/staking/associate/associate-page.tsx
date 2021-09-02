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
import { Web3Container } from "../../../components/web3-container";
import { VegaWalletContainer } from "../../../components/vega-wallet-container";

export const AssociateContainer = () => {
  return (
    <Web3Container>
      {(address) => (
        <VegaWalletContainer>
          {({ vegaKey }) => (
            <AssociatePage address={address} vegaKey={vegaKey} />
          )}
        </VegaWalletContainer>
      )}
    </Web3Container>
  );
};

export const AssociatePage = ({
  address,
  vegaKey,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
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
  } = useAddStake(address, amount, vegaKey.pub, selectedStakingMethod);

  if (txState.txState !== TxState.Default) {
    return (
      <AssociateTransaction
        amount={amount}
        vegaKey={vegaKey.pub}
        state={txState}
        dispatch={txDispatch}
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
          />
        ) : (
          <WalletAssociate
            address={address}
            vegaKey={vegaKey}
            perform={txPerform}
            amount={amount}
            setAmount={setAmount}
          />
        ))}
    </section>
  );
};
