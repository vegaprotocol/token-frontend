import { useTranslation } from "react-i18next";
import { EthereumChainId, EthereumChainNames } from "../lib/web3-utils";
import { Callout } from "./callout";

export const WrongChain = ({
  currentChainId,
  desiredChainId,
}: {
  currentChainId: EthereumChainId;
  desiredChainId: EthereumChainId;
}) => {
  const { t } = useTranslation();
  return (
    <Callout
      title={t("Wrong network", { chain: EthereumChainNames[currentChainId] })}
      intent="error"
    >
      <p>
        {t("Desired network", { chain: EthereumChainNames[desiredChainId] })}
      </p>
    </Callout>
  );
};
