import { useTranslation } from "react-i18next";
import { Colors } from "../../colors";

export const ConnectedVegaKey = ({ pubKey }: { pubKey: string }) => {
  const { t } = useTranslation();
  return (
    <section>
      <strong
        data-testid="connected-vega-key-label"
        style={{ color: Colors.WHITE }}
      >
        {t("Connected Vega key")}
      </strong>
      <p style={{ color: Colors.WHITE }} data-testid="connected-vega-key">
        {pubKey}
      </p>
    </section>
  );
};
