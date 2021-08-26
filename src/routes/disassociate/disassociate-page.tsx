import "./disassociate-page.scss";
import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { ConnectedVegaKey } from "../../components/connected-vega-key";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../components/staking-method-radio";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useSearchParams } from "../../hooks/use-search-params";
import {
  DisassociateActionType,
  disassociateReducer,
  initialDisassociateState,
} from "./disassociate-reducer";
import { useTransaction } from "../../hooks/use-transaction";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { useVegaStaking } from "../../hooks/use-vega-staking";
import { TxState } from "../../hooks/transaction-reducer";
import { WalletDisassociate } from "./wallet-disassociate";
import { ContractDisassociate } from "./contract-disassociate";
import { DisassociateTransaction } from "./disassociate-transaction";

export const DisassociatePage = ({
  address,
  vegaKey,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
}) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [state, dispatch] = useReducer(
    disassociateReducer,
    initialDisassociateState
  );
  const vesting = useVegaVesting();
  const staking = useVegaStaking();
  const { amount } = state;
  const {
    state: vestingBridgeTx,
    dispatch: vestingBridgeDispatch,
    perform: disassociateFromContract,
  } = useTransaction(
    () => vesting.removeStake(address!, amount, vegaKey.pub),
    () => vesting.checkRemoveStake(address!, amount, vegaKey.pub)
  );
  const {
    state: walletTx,
    dispatch: walletDispatch,
    perform: disassociateFromWallet,
  } = useTransaction(
    () => staking.removeStake(address!, amount, vegaKey.pub),
    () => staking.checkRemoveStake(address!, amount, vegaKey.pub)
  );

  const setAmount = React.useCallback(
    (value: string) => {
      dispatch({ type: DisassociateActionType.SET_AMOUNT, amount: value });
    },
    [dispatch]
  );
  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  if (vestingBridgeTx.txState !== TxState.Default) {
    return (
      <DisassociateTransaction
        state={vestingBridgeTx}
        amount={amount}
        vegaKey={vegaKey.pub}
        stakingMethod={stakingMethod as StakingMethod}
        dispatch={vestingBridgeDispatch}
      />
    );
  } else if (walletTx.txState !== TxState.Default) {
    return (
      <DisassociateTransaction
        state={walletTx}
        amount={amount}
        vegaKey={vegaKey.pub}
        stakingMethod={stakingMethod as StakingMethod}
        dispatch={walletDispatch}
      />
    );
  } else {
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
        {selectedStakingMethod &&
          (selectedStakingMethod === StakingMethod.Wallet ? (
            <WalletDisassociate
              setAmount={setAmount}
              amount={amount}
              perform={disassociateFromWallet}
            />
          ) : (
            <ContractDisassociate
              setAmount={setAmount}
              amount={amount}
              perform={disassociateFromContract}
            />
          ))}
      </section>
    );
  }
};
