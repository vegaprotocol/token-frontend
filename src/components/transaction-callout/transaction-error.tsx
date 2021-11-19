import { useTranslation } from "react-i18next";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { CopyToClipboardType } from "../etherscan-link/etherscan-link";
import { Error } from "../icons";

export interface TransactionErrorProps {
  error: Error | null;
  hash: string | null;
  onActionClick: () => void;
}

export const TransactionError = ({
  error,
  hash,
  onActionClick,
}: TransactionErrorProps) => {
  const { t } = useTranslation();

  return (
    <Callout icon={<Error />} intent="error">
      <p>{error ? error.message : t("Something went wrong")}</p>
      {hash ? (
        <p>
          <EtherscanLink tx={hash} copyToClipboard={CopyToClipboardType.LINK} />
        </p>
      ) : null}
      <button onClick={() => onActionClick()}>{t("Try again")}</button>
    </Callout>
  );
};
