import { useTranslation } from "react-i18next";
import { Callout } from "../callout";
import { Error as ErrorIcon } from "../icons";

export const TrancheError = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="tranche-error">
      <Callout icon={<ErrorIcon />} intent="error">
        <p>{t("Something went wrong")}</p>
        <p>{t("We couldn't seem to load your data.")}</p>
      </Callout>
    </section>
  );
};
