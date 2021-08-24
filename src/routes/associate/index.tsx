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
import {
  AssociateActionType,
  associateReducer,
  initialAssociateState,
} from "./associate-reducer";
import { useQueryParam } from "../../hooks/use-query-param";
import { AssociateTransaction } from "./associate-transaction";

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
  const stakingMethod = useQueryParam<StakingMethod>("method");
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

  // TODO probably need this on vega connect
  React.useEffect(() => {
    const run = async () => {
      if (currVegaKey && address) {
        const stakedBalance = await vesting.stakeBalance(
          address,
          currVegaKey.pub
        );
        dispatch({
          type: AssociateActionType.SET_STAKED_BALANCE,
          stakedBalance,
        });
      }
    };
    run();
  }, [address, currVegaKey, vesting]);

  return (
    <TemplateSidebar
      title={t("pageTitleAssociate")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {vestingBridgeTx.txState !== TxState.Default ? (
          <AssociateTransaction
            amount={amount}
            vegaKey={currVegaKey!.pub}
            state={vestingBridgeTx}
            dispatch={vestingBridgeDispatch}
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
