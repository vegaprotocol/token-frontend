import { useTranslation } from "react-i18next";
import { AddTokenButton } from "../../components/add-token-button";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { ADDRESSES } from "../../config";
import "./code-used.scss";
import vegaVesting from "../../images/vega_vesting.png";

export const CodeUsed = ({ address }: { address: string | null }) => {
  const { t } = useTranslation();
  return (
    <Callout intent="warn" icon={<Error />} title={t("codeUsed")}>
      <p>{t("codeUsedText")}</p>
      <h4>
        {t(
          "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
        )}
      </h4>
      <p style={{ display: "flex", justifyContent: "center" }}>
        <AddTokenButton
          size={64}
          address={ADDRESSES.lockedAddress}
          symbol="VEGA-Locked"
          decimals={18}
          image={vegaVesting}
        />
      </p>
      <div className="or">
        <hr />
        {t("Or")} <hr />
      </div>
      <p>
        {t(
          "The token address is {{address}}. Hit the add token button in your ERC20 wallet and enter this address.",
          {
            address: ADDRESSES.lockedAddress,
          }
        )}
      </p>
    </Callout>
  );
};
