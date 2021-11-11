import "./add-token-button.scss";
import { useAddAssetToWallet } from "../../hooks/use-add-asset-to-wallet";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

export const AddTokenButton = ({
  address,
  symbol,
  decimals,
  image,
  size = 32,
}: {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
  size?: number;
}) => {
  const { provider } = useWeb3();
  const addToken = useAddAssetToWallet(address, symbol, decimals, image);
  if (!provider) {
    return null;
  }
  return (
    <button className="add-token-button button-link" onClick={addToken}>
      <img style={{ width: size, height: size }} alt="token-logo" src={image} />
    </button>
  );
};
