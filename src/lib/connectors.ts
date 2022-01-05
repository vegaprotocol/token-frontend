import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { InfuraUrls } from "../config";

export const Connectors = {
  injected: new InjectedConnector({
    supportedChainIds: [1, 3, 1337],
  }),
  walletconnect: new WalletConnectConnector({
    rpc: {
      1: InfuraUrls["0x1"],
      3: InfuraUrls["0x3"],
    },
    qrcode: true,
  }),
};
