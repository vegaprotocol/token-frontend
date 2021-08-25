import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";

export const AssociateInfo = ({ pubKey }: { pubKey: string }) => {
  const { t } = useTranslation();
  return (
    <>
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
        {pubKey}
      </p>
      <h2 data-testid="associate-amount-header">
        {t("How much would you like to associate?")}
      </h2>
    </>
  );
};
