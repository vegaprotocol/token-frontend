import { Addresses, EthereumChainId } from "../../lib/web3-utils";
import { Heading } from "../heading";
import { Notice } from "../notice";

export interface DefaultTemplateProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  const chainId = process.env.REACT_APP_CHAIN as EthereumChainId;
  const { vestingAddress } = Addresses[chainId];
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
