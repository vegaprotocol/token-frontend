import { useTranslation } from "react-i18next";

import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";

export const Expired = ({
  address,
  code,
}: {
  address: string | null;
  code: string;
}) => {
  const { t } = useTranslation();
  return (
    <Callout intent="error" icon={<Error />} title={t("codeExpired")}>
      <p>
        {t(
          "This code ({code}) has expired and cannot be used to claim tokens",
          { code }
        )}
      </p>
    </Callout>
  );
};
