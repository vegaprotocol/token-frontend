import { useTranslation } from "react-i18next";
import { EthConnectPrompt } from "../../components/eth-connect-prompt";
import {
  VegaKeyExtended,
} from "../../contexts/app-state/app-state-context";
import { useEthUser } from "../../hooks/use-eth-user";
import { useVegaUser } from "../../hooks/use-vega-user";
import { ConnectToVega } from "./connect-to-vega";

export const StakingWalletsContainer = ({
  needsEthereum,
  needsVega,
  children,
}: {
  needsEthereum?: boolean,
  needsVega?: boolean,
  children: (data: {
    address: string;
    currVegaKey: VegaKeyExtended | null;
  }) => React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { ethAddress } = useEthUser();
  const { currVegaKey } = useVegaUser();

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

  if (!currVegaKey && needsVega) {
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

  return children({ address: ethAddress, currVegaKey });
};
