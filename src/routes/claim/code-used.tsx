import { Trans, useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Error } from "../../components/icons";
import { LockedBanner } from "./locked-banner";

export const CodeUsed = ({ address }: { address: string | null }) => {
  const { t } = useTranslation();
  return (
    <>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <Callout intent="error" icon={<Error />}>
        <p>{t("Looks like that code has already been used.")}</p>
      </Callout>
      <LockedBanner />
    </>
  );
};
