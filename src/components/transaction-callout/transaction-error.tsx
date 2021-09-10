import { useTranslation } from "react-i18next";
import { EthereumChainId } from "../../config";
import { Callout } from "../callout";
import { EtherscanLink } from "../etherscan-link";
import { Error } from "../icons";

export interface TransactionErrorProps {
  error: Error | null;
  hash: string | null;
  onActionClick: () => void;
  chainId: EthereumChainId;
}

export const TransactionError = ({
  error,
  hash,
  chainId,
  onActionClick,
}: TransactionErrorProps) => {
  const { t } = useTranslation();

  return (
    <Callout icon={<Error />} intent="error">
      <p>{error ? error.message : t("Something went wrong")}</p>
      {hash ? (
        <p>
          <EtherscanLink tx={hash} chainId={chainId} />
        </p>
      ) : null}
      <button onClick={() => onActionClick()}>{t("Try again")}</button>
    </Callout>
  );
};
