import { EthereumChainId, EthereumChainNames } from "../../lib/vega-web3-utils";

export const WrongChain = ({
  currentChainId,
  desiredChainId,
}: {
  currentChainId: EthereumChainId;
  desiredChainId: EthereumChainId;
}) => {
  return (
    <div>
      <h1>Looks like you are on {EthereumChainNames[currentChainId]}</h1>
      <p>
        This app is only configured for {EthereumChainNames[desiredChainId]}
      </p>
    </div>
  );
};
