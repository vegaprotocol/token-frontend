import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { useTransaction } from "../../hooks/use-transaction";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import {
  TransactionActionType,
  TxState,
} from "../../hooks/transaction-reducer";
import { TransactionCallout } from "../../components/transaction-callout";
import { associateReducer, initialAssociateState } from "./associate-reducer";

const useQueryParam = (param: string) => {
  const location = useLocation();
  return React.useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get(param) as StakingMethod | "";
  }, [location.search, param]);
};

enum StakingMethod {
  Contract = "Contract",
  Wallet = "Wallet",
}

const Associate = ({ name }: RouteChildProps) => {
  const { t } = useTranslation();
  useDocumentTitle(name);
  const {
    appState: { currVegaKey, address },
  } = useAppState();
  const vesting = useVegaVesting();
  const stakingMethod = useQueryParam("method");
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  const [state, dispatch] = useReducer(associateReducer, initialAssociateState);
  const { amount } = state;
  const {
    state: vestingBridgeTx,
    dispatch: vestingBridgeDispatch,
    perform,
  } = useTransaction(
    () => vesting.addStake(address!, amount, currVegaKey!.pub),
    () => vesting.checkAddStake(address!, amount, currVegaKey!.pub)
  );

  return (
    <TemplateSidebar
      title={t("pageTitleAssociate")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {vestingBridgeTx.txState !== TxState.Default ? (
          <TransactionCallout
            completeHeading={t("Done")}
            completeBody={t(
              "Vega key {{vegaKey}} can now participate in governance and Nominate a validator with it’s stake.",
              { vegaKey: currVegaKey?.pub }
            )}
            completeFooter={
              <button style={{ width: "100%" }}>
                {t("Nominate Stake to Validator Node")}
              </button>
            }
            pendingHeading={t("Associating Tokens")}
            pendingBody={t(
              "Associating {{amount}} VEGA tokens with Vega key {{vegaKey}}",
              { amount, vegaKey: currVegaKey?.pub }
            )}
            pendingFooter={t(
              "The Vega network requires 30 Confirmations (approx 5 minutes) on Ethereum before crediting your Vega key with your tokens. This page will update once complete or you can come back and check your Vega wallet to see if it is ready to use."
            )}
            state={vestingBridgeTx}
            reset={() =>
              vestingBridgeDispatch({ type: TransactionActionType.TX_RESET })
            }
          />
        ) : null}
        {vestingBridgeTx.txState === TxState.Default && (
          <>
            <p data-testid="associate-information">
              {t(
                "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
              )}
            </p>
            <h2 data-testid="associate-subheader">
              {t("Where would you like to stake from?")}
            </h2>
            <RadioGroup
              inline={true}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                // @ts-ignore
                setSelectedStakingMethod(e.target.value);
              }}
              selectedValue={selectedStakingMethod}
            >
              <Radio
                data-testid="associate-radio-contract"
                label={t("Vesting contract")}
                value={StakingMethod.Contract}
              />
              <Radio
                data-testid="associate-radio-wallet"
                label={t("Wallet")}
                value={StakingMethod.Wallet}
              />
            </RadioGroup>
            {selectedStakingMethod &&
              (selectedStakingMethod === StakingMethod.Contract ? (
                <ContractAssociate
                  perform={perform}
                  state={state}
                  dispatch={dispatch}
                />
              ) : (
                <WalletAssociate />
              ))}
          </>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Associate;
