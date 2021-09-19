import "./add-token-button.scss";
import { useAddAssetToWallet } from "../../hooks/use-add-asset-to-wallet";

export const AddTokenButton = ({
  address,
  symbol,
  decimals,
  image,
}: {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
}) => {
  const addToken = useAddAssetToWallet(address, symbol, decimals, image);
  return (
    <button className="add-token-button button-link" onClick={addToken}>
      <img alt="token-logo" src={image} />
    </button>
  );
};
