import { EthereumChainIds } from "../../lib/web3-utils";

const address = "0x" + "0".repeat(30);

export default function detectEthereumProvider(): Promise<any> {
  class MockedProvider {
    on(event: string, callback: () => void) {
      console.log(`Adding listener for event ${event}`);
    }

    request(obj: any) {
      switch (obj.method) {
        case "eth_requestAccounts":
          return Promise.resolve([address]);
        case "eth_chainId":
          return Promise.resolve(EthereumChainIds.Ropsten);
        default:
          throw new Error(`No mock for provider method ${obj.method}`);
      }
    }
  }

  return Promise.resolve(new MockedProvider());
}
