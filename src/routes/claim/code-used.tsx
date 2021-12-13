import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { AddLockedTokenAddress } from "../../components/add-locked-token";

export const CodeUsed = () => {
  const { t } = useTranslation();
  return (
    <Callout intent="action" icon={<Error />} title={t("codeUsed")}>
      <p>{t("codeUsedText")}</p>
      <AddLockedTokenAddress />
    </Callout>
  );
};
