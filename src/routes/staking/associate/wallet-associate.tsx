import "./wallet-associate.scss";
import { useTranslation } from "react-i18next";
import {
  AppStateActionType,
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { BigNumber } from "../../../lib/bignumber";
import { AssociateInfo } from "./associate-info";
import React from "react";
import { useTransaction } from "../../../hooks/use-transaction";
import { useVegaToken } from "../../../hooks/use-vega-token";
import {
  TransactionActionType,
  TxState,
} from "../../../hooks/transaction-reducer";
import { TransactionCallout } from "../../../components/transaction-callout";
import { TokenInput } from "../../../components/token-input";
import { ADDRESSES } from "../../../config";

export const WalletAssociate = ({
  perform,
  vegaKey,
  amount,
  setAmount,
  address,
}: {
  perform: () => void;
  amount: string;
  setAmount: React.Dispatch<string>;
  vegaKey: VegaKeyExtended;
  address: string;
}) => {
  const { t } = useTranslation();
  const {
    appDispatch,
    appState: { walletBalance, allowance, walletAssociatedBalance },
  } = useAppState();
  const token = useVegaToken();
  const {
    state: approveState,
    perform: approve,
    dispatch: approveDispatch,
  } = useTransaction(() => token.approve(address, ADDRESSES.stakingBridge));
  const maximum = React.useMemo(
    () =>
      BigNumber.min(new BigNumber(walletBalance), new BigNumber(allowance!)),
    [allowance, walletBalance]
  );

  // Once they have approved deposits then we need to refresh their allowance
  React.useEffect(() => {
    const run = async () => {
      if (approveState.txState === TxState.Complete) {
        const allowance = await token.allowance(
          address,
          ADDRESSES.stakingBridge
        );
        appDispatch({
          type: AppStateActionType.SET_ALLOWANCE,
          allowance,
        });
      }
    };
    run();
  }, [address, appDispatch, approveState.txState, token]);

  let pageContent = null;
  if (new BigNumber(walletBalance).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method."
        )}
      </div>
    );
  } else if (
    new BigNumber(walletBalance).minus(walletAssociatedBalance!).isEqualTo("0")
  ) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key"
        )}
      </div>
    );
  } else if (
    approveState.txState !== TxState.Default &&
    approveState.txState !== TxState.Complete
  ) {
    pageContent = (
      <>
        <AssociateInfo pubKey={vegaKey.pub} />
        <TokenInput
          submitText={t("Associate VEGA Tokens with key")}
          perform={() => undefined}
          maximum={maximum}
          amount={amount}
          setAmount={setAmount}
        />
        <TransactionCallout
          state={approveState}
          reset={() =>
            approveDispatch({ type: TransactionActionType.TX_RESET })
          }
        />
      </>
    );
  } else {
    pageContent = (
      <>
        <AssociateInfo pubKey={vegaKey.pub} />
        <TokenInput
          approveText={t("Approve VEGA tokens for staking on Vega")}
          submitText={t("Associate VEGA Tokens with key")}
          approve={approve}
          perform={() => undefined}
          maximum={maximum}
          amount={amount}
          setAmount={setAmount}
        />
      </>
    );
  }

  return <section data-testid="wallet-associate">{pageContent}</section>;
};
