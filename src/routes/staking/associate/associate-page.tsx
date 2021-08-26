import React from "react";
import { useTranslation } from "react-i18next";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import { useTransaction } from "../../../hooks/use-transaction";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../../hooks/use-vega-vesting";
import { TxState } from "../../../hooks/transaction-reducer";
import { AssociateTransaction } from "./associate-transaction";
import { useSearchParams } from "../../../hooks/use-search-params";
import { useVegaStaking } from "../../../hooks/use-vega-staking";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../../components/staking-method-radio";
import { useVegaToken } from "../../../hooks/use-vega-token";

const useAddStake = (
  address: string,
  amount: string,
  vegaKey: string,
  stakingMethod: StakingMethod | ""
) => {
  const { appState, appDispatch } = useAppState();
  const vesting = useVegaVesting();
  const staking = useVegaStaking();
  const token = useVegaToken();
  const contractAdd = useTransaction(
    () => vesting.addStake(address!, amount, vegaKey),
    () => vesting.checkAddStake(address!, amount, vegaKey)
  );
  const walletAdd = useTransaction(
    () => staking.addStake(address!, amount, vegaKey),
    () => staking.checkAddStake(address!, amount, vegaKey)
  );

  React.useEffect(() => {
    const run = async () => {
      const [balance, walletBalance, lien, allowance, vegaAssociatedBalance] =
        await Promise.all([
          vesting.getUserBalanceAllTranches(address),
          token.balanceOf(address),
          vesting.getLien(address),
          token.allowance(address, appState.contractAddresses.stakingBridge),
          staking.stakeBalance(address, vegaKey),
        ]);
      appDispatch({
        type: AppStateActionType.REFRESH_BALANCES,
        balance,
        walletBalance,
        allowance,
        lien,
        vegaAssociatedBalance,
      });
    };
    if (
      walletAdd.state.txState === TxState.Complete ||
      contractAdd.state.txState === TxState.Complete
    ) {
      run();
    }
  }, [
    address,
    appDispatch,
    appState.chainId,
    appState.contractAddresses.stakingBridge,
    contractAdd.state.txState,
    staking,
    token,
    vegaKey,
    vesting,
    walletAdd.state.txState,
  ]);

  return React.useMemo(() => {
    if (stakingMethod === StakingMethod.Contract) {
      return walletAdd;
    } else {
      return contractAdd;
    }
  }, [contractAdd, stakingMethod, walletAdd]);
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
