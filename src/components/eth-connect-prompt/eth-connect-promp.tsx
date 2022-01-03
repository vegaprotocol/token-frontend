import { useWeb3 } from "../../hooks/use-web3";
import { useTranslation } from "react-i18next";

import { injected } from "../../lib/connectors";

interface EthConnectPrompProps {
  children?: React.ReactNode;
}

export const EthConnectPrompt = ({ children }: EthConnectPrompProps) => {
  const { t } = useTranslation();
  const { activate } = useWeb3();
  return (
    <>
      {children}
      <button onClick={() => activate(injected)} className="fill" type="button">
        {t("connectEthWallet")}
      </button>
    </>
  );
};
