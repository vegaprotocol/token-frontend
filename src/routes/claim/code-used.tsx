import { useTranslation } from "react-i18next";
import { AddTokenButtonLink } from "../../components/add-token-button";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { ADDRESSES } from "../../config";
import "./code-used.scss";
import vegaVesting from "../../images/vega_vesting.png";
import { useAddAssetSupported } from "../../hooks/use-add-asset-to-wallet";

export const CodeUsed = ({ address }: { address: string | null }) => {
  const { t } = useTranslation();
  const addSupported = useAddAssetSupported();
  return (
    <Callout intent="warn" icon={<Error />} title={t("codeUsed")}>
      <p>{t("codeUsedText")}</p>
      <h4>
        {t(
          "Keep track of locked tokens in your wallet with the VEGA (VESTING) token."
        )}
      </h4>
      {addSupported ? (
        <>
          <p style={{ display: "flex", justifyContent: "center" }}>
            <AddTokenButtonLink
              address={ADDRESSES.lockedAddress}
              symbol="VEGA🔒"
              decimals={18}
              image={vegaVesting}
            />
          </p>
          <div className="or">
            <hr />
            {t("Or")} <hr />
          </div>
        </>
      ) : null}
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
