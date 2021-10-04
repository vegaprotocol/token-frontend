import "./disassociate-page.scss";

import { DisassociatePage } from "./disassociate-page";
import { DisassociatePageNoVega } from "./disassociate-page-no-vega";
import { StakingWalletsContainer } from "../staking-wallets-container";

export const DisassociateContainer = () => {
  return (
    <StakingWalletsContainer needsEthereum={true} needsVega={false}>
      {({ address, currVegaKey = null }) => (
        currVegaKey
        ? <DisassociatePage address={address} vegaKey={currVegaKey} />
        : <DisassociatePageNoVega />
      )}
    </StakingWalletsContainer>
  );
};
