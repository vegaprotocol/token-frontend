import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import { useTransaction } from "../../hooks/use-transaction";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { TxState } from "../../hooks/transaction-reducer";
import { associateReducer, initialAssociateState } from "./associate-reducer";
import { AssociateTransaction } from "./associate-transaction";
import { useSearchParams } from "../../hooks/use-search-params";
import { useVegaStaking } from "../../hooks/use-vega-staking";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../components/staking-method-radio";

export const AssociatePage = ({
  address,
  vegaKey,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
}) => {
  const { t } = useTranslation();
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
    () => vesting.addStake(address!, amount, vegaKey.pub),
    () => vesting.checkAddStake(address!, amount, vegaKey.pub)
  );
  const {
    state: walletTx,
    dispatch: walletDispatch,
    perform: stakeFromWallet,
  } = useTransaction(
    () => staking.addStake(address!, amount, vegaKey.pub),
    () => staking.checkAddStake(address!, amount, vegaKey.pub)
  );

  return (
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
            <StakingMethodRadio
              setSelectedStakingMethod={setSelectedStakingMethod}
              selectedStakingMethod={selectedStakingMethod}
            />
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
  );
};
