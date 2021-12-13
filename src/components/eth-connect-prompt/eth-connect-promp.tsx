import { useTranslation } from "react-i18next";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

interface EthConnectPrompProps {
  children?: React.ReactNode;
}

export const EthConnectPrompt = ({ children }: EthConnectPrompProps) => {
  const { t } = useTranslation();
  const { connect } = useWeb3();
  return (
    <>
      {children}
      <button onClick={connect} className="fill" type="button">
        {t("connectEthWallet")}
      </button>
    </>
  );
};
