import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { DefaultTemplate } from "../../components/page-templates/default";
import {
  ProviderStatus,
  useAppState,
} from "../../contexts/app-state/app-state-context";

const NoProvider = () => {
  const { t } = useTranslation();
  const {
    appState: { providerStatus },
  } = useAppState();
  if (providerStatus === ProviderStatus.Ready) {
    return <Redirect to="/" />;
  }
  return (
    <DefaultTemplate title={t("Cannot connect")}>
      <p>{t("invalidWeb3Browser")}</p>
    </DefaultTemplate>
  );
};

export default NoProvider;
