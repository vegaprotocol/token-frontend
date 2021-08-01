import { useVegaWeb3 } from "../../hooks/use-vega-web3";
import { Addresses } from "../../lib/vega-web3";
import { EthereumChainIds } from "../../lib/web3-utils";
import { Heading } from "../heading";
import { Notice } from "../notice";

export interface DefaultTemplateProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  const vega = useVegaWeb3(EthereumChainIds.Mainnet);
  const { vestingAddress } = Addresses[vega.chainId];
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{children}</main>
      <footer>
        <Notice vestingAddress={vestingAddress} />
      </footer>
    </div>
  );
}
