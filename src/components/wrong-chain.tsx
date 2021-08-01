import { useTranslation } from "react-i18next";
import { EthereumChainId, EthereumChainNames } from "../lib/web3-utils";

export const WrongChain = ({
  currentChainId,
  desiredChainId,
}: {
  currentChainId: EthereumChainId;
  desiredChainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>
        {t("Wrong network", { chain: EthereumChainNames[currentChainId] })}
      </h1>
      <p>
        {t("Desired network", { chain: EthereumChainNames[desiredChainId] })}
      </p>
    </div>
  );
};
