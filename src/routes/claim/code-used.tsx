import { useTranslation } from "react-i18next";
import { AddTokenButton } from "../../components/add-token-button";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { ADDRESSES } from "../../config";

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
          image={
            "https://s2.coinmarketcap.com/static/img/coins/64x64/10223.png"
          }
        />
      </p>
      <div style={{ display: "flex ", margin: "12px 0px" }}>
        <hr style={{ flex: 1, marginRight: 12, marginTop: 12 }} />
        Or <hr style={{ flex: 1, marginLeft: 12, marginTop: 12 }} />
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
