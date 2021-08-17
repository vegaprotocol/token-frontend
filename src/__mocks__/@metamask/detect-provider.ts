const BASE_URL = "../mocks/detect-provider";

export default function detectEthereumProvider(): Promise<any> {
  class MockedProvider {
    private async performFetch<T>(url: string, data?: any): Promise<T> {
      if (data) {
        const res = await fetch(`${BASE_URL}/${url}`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        return res.json() as unknown as T;
      } else {
        const res = await fetch(`${BASE_URL}/${url}`);
        return res.json() as unknown as T;
      }
    }

    on(event: string, callback: () => void) {
      console.log(`Adding listener for event ${event}`);
    }

    async request(obj: any) {
      switch (obj.method) {
        case "eth_requestAccounts":
          const { address } = await this.performFetch<{ address: string }>(
            "address"
          );
          return address;
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
