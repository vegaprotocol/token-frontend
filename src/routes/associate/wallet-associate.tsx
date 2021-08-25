import "./wallet-associate.scss";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { AssociateFrom } from "./associate-form";
import { AssociateAction, AssociateState } from "./associate-reducer";
import React from "react";
import { Button } from "@blueprintjs/core";

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
        <AssociateFrom
          state={state}
          maximum={maximum}
          dispatch={dispatch}
          pubKey={currVegaKey!.pub}
        />
        <Button
          data-testid="approve-button"
          fill={true}
          disabled={isDisabled}
          onClick={perform}
        >
          {t("Approve VEGA tokens for staking on Vega")}
        </Button>
        <Button
          style={{ marginTop: 10 }}
          data-testid="associate-button"
          fill={true}
          disabled={isDisabled}
          onClick={perform}
        >
          {t("Associate VEGA Tokens with key")}
        </Button>
      </>
    );
  }

  return <section data-testid="wallet-associate">{pageContent}</section>;
};
