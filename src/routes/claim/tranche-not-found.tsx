import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";

// TODO: Provide a better message
export const TrancheNotFound = () => {
  const { t } = useTranslation();
  return (
    <Callout intent="error" icon={<Error />}>
      <p>{t("Tranche not found")}</p>
    </Callout>
  );
};
