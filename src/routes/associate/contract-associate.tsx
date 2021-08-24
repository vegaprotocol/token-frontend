import "./contract-associate.scss";
import { Button, FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { Callout } from "../../components/callout";
import React from "react";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { useTransaction } from "../../hooks/use-transaction";
import { TransactionCallout } from "../../components/transaction-callout";
import {
  TransactionActionType,
  TxState,
} from "../../hooks/transaction-reducer";

export const ContractAssociate = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState<string | undefined>("");
  const [stakedBalance, setStakedBalance] = React.useState<BigNumber>(
    new BigNumber("0")
  );
  const {
    appState: { currVegaKey, address, balanceFormatted },
  } = useAppState();
  const vesting = useVegaVesting();
  React.useEffect(() => {
    const run = async () => {
      if (currVegaKey && address) {
        const stakedBalance = await vesting.stakeBalance(
          address,
          currVegaKey.pub
        );
        setStakedBalance(stakedBalance);
      }
    };
    run();
  }, [address, currVegaKey, vesting]);
  const maximum = React.useMemo(() => {
    return new BigNumber(balanceFormatted).minus(stakedBalance).toString();
  }, [balanceFormatted, stakedBalance]);
  const useMaximum = React.useCallback(() => {
    setAmount(maximum);
  }, [setAmount, maximum]);
  const inputName = "amount";
  const isDisabled = React.useMemo<boolean>(
    () =>
      !amount ||
      new BigNumber(amount).isLessThanOrEqualTo("0") ||
      new BigNumber(amount).isGreaterThan(maximum),
    [amount, maximum]
  );
  const {
    state: txState,
    dispatch: txDispatch,
    perform,
  } = useTransaction(
    () => vesting.addStake(address!, amount!, currVegaKey!.pub),
    () => vesting.checkAddStake(address!, amount!, currVegaKey!.pub)
  );

  return (
    <section className="contract-associate" data-testid="contract-associate">
      <Callout>
        {t(
          "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed."
        )}
      </Callout>
      <h2 data-testid="associate-vega-key-header">
        {t("What Vega wallet/key is going to control your stake?")}
      </h2>
      <strong
        data-testid="associate-vega-key-label"
        style={{ color: Colors.WHITE }}
      >
        {t("Connected Vega key")}
      </strong>
      <p style={{ color: Colors.WHITE }} data-testid="associate-vega-key">
        {currVegaKey?.pub}
      </p>
      <h2 data-testid="associate-amount-header">
        {t("How much would you like to associate?")}
      </h2>
      <FormGroup label="" labelFor={inputName}>
        <div style={{ display: "flex" }}>
          <InputGroup
            data-testid="associate-amount-input"
            className="contract-associate__input"
            name={inputName}
            id={inputName}
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            intent={Intent.NONE}
            rightElement={<Tag minimal={true}>{t("VEGA Tokens")}</Tag>}
            autoComplete="off"
            type="number"
          />
          <button
            onClick={useMaximum}
            data-testid="associate-amount-use-maximum"
            className="button-link contract-associate__use-maximum "
          >
            {t("Use maximum")}
          </button>
        </div>
      </FormGroup>
      <Button
        data-testid="associate-button"
        fill={true}
        disabled={isDisabled}
        onClick={perform}
      >
        {t("Associate VEGA Tokens with key")}
      </Button>
      {txState.txState !== TxState.Default ? (
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
          state={txState}
          reset={() => txDispatch({ type: TransactionActionType.TX_RESET })}
        />
      ) : null}
    </section>
  );
};
