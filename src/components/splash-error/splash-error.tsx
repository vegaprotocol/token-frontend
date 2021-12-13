import { useTranslation } from "react-i18next";
import "./splash-error.scss";

export const SplashError = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="splash-error__icon">
        <span />
        <span />
      </div>
      {t("networkDown")}
    </div>
  );
};
