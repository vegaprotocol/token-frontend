import { useTranslation } from "react-i18next";

import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { useVegaUser } from "../../hooks/use-vega-user";
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
  const { ethAddress } = useWeb3();
  const { currVegaKey } = useVegaUser();

  if (!ethAddress && needsEthereum) {
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

  return children({ address: ethAddress, currVegaKey });
};
