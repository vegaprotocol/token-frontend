import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Error as ErrorIcon } from "../../components/icons";

export const RedemptionError = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="redemption-error">
      <Callout icon={<ErrorIcon />} intent="error">
        <p>{t("Something went wrong")}</p>
        <p>{t("We couldn't seem to load your data.")}</p>
      </Callout>
    </section>
  );
};
