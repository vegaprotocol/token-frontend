import "./contract-associate.scss";
import {
  Button,
  Callout,
  FormGroup,
  InputGroup,
  Intent,
  Tag,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";

export const ContractAssociate = () => {
  const { t } = useTranslation();
  const inputName = "amount";
  const vegaKey =
    "65ea371c556f5648640c243dd30cf7374b5501ffe3dc8603476f723dd636656e";
  return (
    <>
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
            onChange={(e) => console.log(e)}
            value={"123"}
            intent={Intent.NONE}
            rightElement={<Tag minimal={true}>{t("VEGA Tokens")}</Tag>}
            autoComplete="off"
          />
          <a
            data-testid="associate-amount-use-maximum"
            className="contract-associate__use-maximum"
          >
            {t("Use maximum")}
          </a>
        </div>
      </FormGroup>
      <Button data-testid="associate-button" fill={true}>
        {t("Associate VEGA Tokens with key")}
      </Button>
    </>
  );
};
