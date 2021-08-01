import { Trans } from "react-i18next";

export const Expired = ({
  address,
  code,
}: {
  address: string | null;
  code: string;
}) => {
  return (
    <div>
      <p>
        <Trans
          i18nKey="Connected to Ethereum key {address}"
          values={{ address }}
          components={{ bold: <strong /> }}
        />
      </p>
      <p>This code ({code}) has expired and cannot be used to claim tokens.</p>
    </div>
  );
};
