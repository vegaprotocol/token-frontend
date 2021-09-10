import "./notice.scss";
import { useTranslation } from "react-i18next";
import { ADDRESSES } from "../../config";
import { EtherscanLink } from "../etherscan-link";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const Notice = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  return (
    <div className="notice">
      <p>{t("projectDescription")}</p>
      <p>
        {t("The contract is deployed at the following address")}{" "}
        <EtherscanLink
          chainId={appState.chainId}
          address={ADDRESSES.vestingAddress}
          text={ADDRESSES.vestingAddress}
        />
      </p>
    </div>
  );
};
