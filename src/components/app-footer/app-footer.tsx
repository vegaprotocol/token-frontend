import "./app-footer.scss";
import { useTranslation } from "react-i18next";
import { Links } from "../../config";

export const AppFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="app-footer">
      <p>
        {t("version")}: {process.env.COMMIT_REF || "development"}
      </p>
      <p>
        <a href={Links.KNOWN_ISSUES}>{t("footerKnownIssues")}</a>
      </p>
    </footer>
  );
};
