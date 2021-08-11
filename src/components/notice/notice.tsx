import "./notice.scss";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../contexts/app-state/app-state-context";

export const Notice = () => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  return (
    <div className="notice">
      <p>{t("projectDescription")}</p>
      <p>
        {t("The contract is deployed at the following address")}{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={
            "https://etherscan.io/address/" +
            appState.contractAddresses.vestingAddress
          }
        >
          {appState.contractAddresses.vestingAddress}
        </a>
      </p>
    </div>
  );
};
