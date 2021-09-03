import "./notice.scss";
import { useTranslation } from "react-i18next";
import { ADDRESSES } from "../../config";

export const Notice = () => {
  const { t } = useTranslation();
  return (
    <div className="notice">
      <p>{t("projectDescription")}</p>
      <p>
        {t("The contract is deployed at the following address")}{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={"https://etherscan.io/address/" + ADDRESSES.vestingAddress}
        >
          {ADDRESSES.vestingAddress}
        </a>
      </p>
    </div>
  );
};
