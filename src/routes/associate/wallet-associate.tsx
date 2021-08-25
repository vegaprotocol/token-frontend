import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { AssociateInfo } from "./associate-info";
import { AssociateAction, AssociateState } from "./associate-reducer";
import React from "react";
import { AssociateInput } from "./associate-input";

export const WalletAssociate = ({
  perform,
  state,
  dispatch,
}: {
  perform: () => void;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
}) => {
  // TODO
  const stakedAmount = 0;
  const isApproved = false;

  const { amount } = state;
  const { t } = useTranslation();
  const {
    appState: { walletBalance, currVegaKey },
  } = useAppState();
  let pageContent = null;

  const maximum = React.useMemo(
    () => new BigNumber(walletBalance),
    [walletBalance]
  );
  const isDisabled = React.useMemo<boolean>(
    () =>
      !isApproved ||
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum),
    [amount, isApproved, maximum]
  );
  if (new BigNumber(walletBalance).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "You have no VEGA tokens in your connected wallet. You will need to buy some VEGA tokens from an exchange in order to stake using this method."
        )}
      </div>
    );
  } else if (new BigNumber(walletBalance).minus(stakedAmount).isEqualTo("0")) {
    pageContent = (
      <div className="wallet-associate__error">
        {t(
          "All VEGA tokens in the connected wallet is already associated with a Vega wallet/key"
        )}
      </div>
    );
  } else {
    pageContent = (
      <>
        <AssociateInfo pubKey={currVegaKey!.pub} />
        <AssociateInput state={state} maximum={maximum} dispatch={dispatch} />
        <button
          data-testid="approve-button"
          style={{ width: "100%" }}
          disabled={isApproved}
          onClick={perform}
        >
          {t("Approve VEGA tokens for staking on Vega")}
        </button>
        <button
          style={{ marginTop: 10, width: "100%" }}
          data-testid="associate-button"
          disabled={isDisabled}
          onClick={perform}
        >
          {t("Associate VEGA Tokens with key")}
        </button>
      </>
    );
  }

  return <section data-testid="wallet-associate">{pageContent}</section>;
};
