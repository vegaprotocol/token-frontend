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
import { useNetworkParam } from "../../governance/use-network-param";
import * as Sentry from "@sentry/react";

export const ETH_NETWORK_PARAM = "blockchains.ethereumConfig";

const useEthereumConfig = () => {
  const { data: ethereumConfigJSON, loading } = useNetworkParam([
    ETH_NETWORK_PARAM,
  ]);
  const ethereumConfig = React.useMemo(() => {
    if (!ethereumConfigJSON && !loading) {
      Sentry.captureMessage(
        `No ETH config found for network param ${ETH_NETWORK_PARAM}`
      );
      return null;
    } else if (!ethereumConfigJSON) {
      return null;
    }
    try {
      const [configJson] = ethereumConfigJSON;
      const config = JSON.parse(configJson);
      return config;
    } catch {
      Sentry.captureMessage("Ethereum config JSON is invalid");
      return null;
    }
  }, [ethereumConfigJSON, loading]);

  if (!ethereumConfig) {
    return null;
  }

  return {
    confirmations: ethereumConfig.confirmations,
  };
};

export const NetworkParamsContainer = ({
  children,
}: {
  children: (data: { confirmations: number }) => React.ReactElement;
}) => {
  const config = useEthereumConfig();
  if (!config) {
    return null;
  }
  return children({ confirmations: config.confirmations });
};

export const AssociateContainer = () => {
  return (
    <NetworkParamsContainer>
      {(data) => (
        <StakingWalletsContainer>
          {({ address, currVegaKey }) => (
            <AssociatePage
              address={address}
              vegaKey={currVegaKey}
              confirmations={data.confirmations}
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
  confirmations,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
  confirmations: number;
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
    confirmations
  );

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
