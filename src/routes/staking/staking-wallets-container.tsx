import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import {
  useVegaWallet,
  VegaKeyExtended,
} from "../../contexts/vega-wallet/vega-wallet-context";
import { useEthUser } from "../../hooks/use-eth-user";
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
  const { ethAddress } = useEthUser();
  const { vegaWalletState } = useVegaWallet();

  if (!ethAddress && needsEthereum) {
    return (
      <EthConnectPrompt>
        <p>
          {t(
            "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
          )}
        </p>
      </EthConnectPrompt>
    );
  }

  if (!vegaWalletState.currKey && needsVega) {
    return (
      <>
        <p>
          {t(
            "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
          )}
        </p>
        <ConnectToVega />
      </>
    );
  }

  return children({
    address: ethAddress,
    currVegaKey: vegaWalletState.currKey,
  });
};
