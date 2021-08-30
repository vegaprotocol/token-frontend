import "./connected-vega-key.scss";
import { useTranslation } from "react-i18next";

export const ConnectedVegaKey = ({ pubKey }: { pubKey: string }) => {
  const { t } = useTranslation();
  return (
    <section className="connected-vega-key">
      <strong data-testid="connected-vega-key-label">
        {t("Connected Vega key")}
      </strong>
      <p data-testid="connected-vega-key">{pubKey}</p>
    </section>
  );
};
