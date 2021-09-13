const BASE_URL = "http://localhost:3000/mocks/detect-provider";

export default function detectEthereumProvider(): Promise<any> {
  class MockedProvider {
    private async performFetch<T>(url: string, data?: any): Promise<T> {
      const res = await fetch(`${BASE_URL}/${url}`);
      return res.json() as unknown as T;
    }

    removeAllListeners() {}

    on(event: string, callback: () => void) {
      console.log(`Adding listener for event ${event}`);
    }

    removeAllListeners() {
      // no op for mock
    }

    async request(obj: any) {
      switch (obj.method) {
        case "eth_requestAccounts":
          const { accounts } = await this.performFetch<{ accounts: string[] }>(
            "accounts"
          );
          return accounts;
        case "eth_chainId":
          const { chain } = await this.performFetch<{ chain: string }>("chain");
          return chain;
        default:
          throw new Error(`No mock for provider method ${obj.method}`);
      }
    }
  }

  return Promise.resolve(new MockedProvider());
}
