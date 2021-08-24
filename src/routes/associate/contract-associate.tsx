import "./contract-associate.scss";
import { Button, FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { Callout } from "../../components/callout";
import React from "react";
// import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";

export const ContractAssociate = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState<string | undefined>("");
  const stakedBalance = 0;
  const {
    appState: { currVegaKey, balanceFormatted },
  } = useAppState();
  // const vesting = useVegaVesting();
  // React.useEffect(() => {
  //   const run = async () => {
  //     if (currVegaKey && address) {
  //       const totalStaked = await vesting.totalStaked();
  //       console.log(currVegaKey.pub, address, totalStaked.toString());
  //       const stakedBalance = await vesting.stakeBalance(
  //         address,
  //         currVegaKey.pub
  //       );
  //       console.log(stakedBalance.toString());
  //     }
  //   };
  //   run();
  // }, [address, currVegaKey, vesting]);
  const maximum = React.useMemo(() => {
    return new BigNumber(balanceFormatted).minus(stakedBalance).toString();
  }, [balanceFormatted]);
  const useMaximum = React.useCallback(() => {
    setAmount(maximum);
  }, [setAmount, maximum]);
  const inputName = "amount";
  const isDisabled = React.useMemo<boolean>(
    () =>
      !amount || amount === "0" || new BigNumber(amount).isGreaterThan(maximum),
    [amount, maximum]
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
      <Button data-testid="associate-button" fill={true} disabled={isDisabled}>
        {t("Associate VEGA Tokens with key")}
      </Button>
    </section>
  );
};
