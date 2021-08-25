import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import { TemplateSidebar } from "../../components/page-templates/template-sidebar";
import { EthWallet } from "../../components/eth-wallet";
import { VegaWallet } from "../../components/vega-wallet";
import { useTransaction } from "../../hooks/use-transaction";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { TxState } from "../../hooks/transaction-reducer";
import { associateReducer, initialAssociateState } from "./associate-reducer";
import { AssociateTransaction } from "./associate-transaction";
import { useSearchParams } from "../../hooks/use-search-params";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { useVegaStaking } from "../../hooks/use-vega-staking";

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
  const staking = useVegaStaking();
  const params = useSearchParams();
  const stakingMethod = params.method as StakingMethod | "";

  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  const [state, dispatch] = useReducer(associateReducer, initialAssociateState);
  const { amount } = state;
  const {
    state: vestingBridgeTx,
    dispatch: vestingBridgeDispatch,
    perform: stakeToVesting,
  } = useTransaction(
    () => vesting.addStake(address!, amount, currVegaKey!.pub),
    () => vesting.checkAddStake(address!, amount, currVegaKey!.pub)
  );
  const {
    state: walletTx,
    dispatch: walletDispatch,
    perform: stakeFromWallet,
  } = useTransaction(
    () => staking.addStake(address!, amount, currVegaKey!.pub),
    () => staking.checkAddStake(address!, amount, currVegaKey!.pub)
  );

  return (
    <TemplateSidebar
      title={t("pageTitleAssociate")}
      sidebarButtonText={t("viewKeys")}
      sidebar={[<EthWallet />, <VegaWallet />]}
    >
      <Web3Container>
        {(address) => (
          <VegaWalletContainer>
            {/* TODO move this into it's own component this is getting pretty bulky */}
            {({ vegaKey }) => (
              <>
                {vestingBridgeTx.txState !== TxState.Default ? (
                  <AssociateTransaction
                    amount={amount}
                    vegaKey={vegaKey.pub}
                    state={vestingBridgeTx}
                    dispatch={vestingBridgeDispatch}
                  />
                ) : null}
                {walletTx.txState !== TxState.Default ? (
                  <AssociateTransaction
                    amount={amount}
                    vegaKey={vegaKey.pub}
                    state={walletTx}
                    dispatch={walletDispatch}
                  />
                ) : null}
                {vestingBridgeTx.txState === TxState.Default &&
                  walletTx.txState === TxState.Default && (
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
                            vegaKey={vegaKey}
                            perform={stakeToVesting}
                            state={state}
                            dispatch={dispatch}
                          />
                        ) : (
                          <WalletAssociate
                            address={address}
                            vegaKey={vegaKey}
                            perform={stakeFromWallet}
                            state={state}
                            dispatch={dispatch}
                          />
                        ))}
                    </>
                  )}
              </>
            )}
          </VegaWalletContainer>
        )}
      </Web3Container>
    </TemplateSidebar>
  );
};

export default Associate;
