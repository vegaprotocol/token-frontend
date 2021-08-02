import { Trans, useTranslation } from "react-i18next";

export const Expired = ({
  address,
  code,
}: {
  address: string | null;
  code: string;
}) => {
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
      <p>
        {t(
          "This code ({code}) has expired and cannot be used to claim tokens. ",
          { code }
        )}
        .
      </p>
    </div>
  );
};
