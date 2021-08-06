import { Trans, useTranslation } from "react-i18next";
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
    <>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <Callout intent="error" icon={<Error />}>
        <p>
          {t(
            "This code ({code}) has expired and cannot be used to claim tokens",
            { code }
          )}
        </p>
      </Callout>
    </>
  );
};
