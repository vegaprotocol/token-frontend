import { Trans, useTranslation } from "react-i18next";
import { LockedBanner } from "./locked-banner";

export const CodeUsed = ({ address }: { address: string | null }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <p>{t("Looks like that code has already been used.")}</p>
      <LockedBanner />
    </div>
  );
};
