import "./contract-associate.scss";
import { Button, FormGroup, InputGroup, Intent, Tag } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";
import { Callout } from "../../components/callout";
import React from "react";
import { useVegaVesting } from "../../hooks/use-vega-vesting";

export const ContractAssociate = () => {
  const vesting = useVegaVesting();
  const [amount, setAmount] = React.useState<string | undefined>("");
  const { t } = useTranslation();
  const maximum = "123";
  const useMaximum = React.useCallback(() => {
    setAmount(maximum);
  }, [setAmount, maximum]);
  const inputName = "amount";
  const vegaKey =
    "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e";
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
        {vegaKey}
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
      <Button data-testid="associate-button" fill={true} disabled={!amount}>
        {t("Associate VEGA Tokens with key")}
      </Button>
    </section>
  );
};
