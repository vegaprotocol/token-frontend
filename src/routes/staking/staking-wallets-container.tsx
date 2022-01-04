import { useTranslation } from "react-i18next";

import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useVegaUser } from "../../hooks/use-vega-user";
import { useWeb3 } from "../../hooks/use-web3";
import { ConnectToVega } from "./connect-to-vega";

export const StakingWalletsContainer = ({
  needsEthereum,
  needsVega,
  children,
}: {
  needsEthereum?: boolean;
  needsVega?: boolean;
  children: (data: {
    address: string;
    currVegaKey: VegaKeyExtended | null;
  }) => React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3();
  const { currVegaKey } = useVegaUser();

  if (!account && needsEthereum) {
    return (
      <EthConnectPrompt>
        <p>{t("associateInfo1")}</p>
        <p>{t("associateInfo2")}</p>
      </EthConnectPrompt>
    );
  }

  if (!currVegaKey && needsVega) {
    return (
      <>
        <EthConnectPrompt>
          <p>{t("associateInfo1")}</p>
          <p>{t("associateInfo2")}</p>
        </EthConnectPrompt>
        <ConnectToVega />
      </>
    );
  }

  return children({ address: account || "", currVegaKey });
};
