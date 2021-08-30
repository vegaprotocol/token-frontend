import {Addresses, EthereumChainId, EthereumChainIds} from "../../lib/web3-utils";

/**
 * Some tranches have names that will be useful to
 * users trying to identify where their tokens are.
 * This component will render either nothing or a
 * name
 *
 * @param contract The contract address for the vesting contract
 * @param chainId The ID of the chain this contract is on
 * @param id The tranche ID on this contract
 */

export const TrancheTitle = ({ contract, chainId, id}: {
  chainId: EthereumChainId | null,
  contract: string,
  id: number
}) => {
  // Only mainnet tranches on the known vesting contract have useful name
  if (chainId && chainId === EthereumChainIds.Mainnet && contract === Addresses[chainId].vestingAddress) {
    if (id === 5) {
      return <span>Coinlist Option 1 / Community Whitelist</span>
    } else if (id === 6) {
      return <span>Coinlist Option 2</span>
    } else if (id === 7) {
      return <span>Coinlist Option 3</span>
    } else if (id === 11) {
      return <span>Fairground rewards</span>
    }
  }

  return null
};
