import BigNumber from "bignumber.js";
import { addDecimal } from "../../decimals";
import { IVegaToken, PromiEvent } from "../../web3-utils";
import { promiEventFactory, uuidv4 } from "./promi-manager";

const BASE_URL = "mocks/vega-token";

class MockedToken implements IVegaToken {
  private mockDecimals = 5;
  private mockTotalSupply = new BigNumber(1000000000);

  private async performFetch(url: string, data?: any) {
    if (data) {
      const res = await fetch(`${BASE_URL}/${url}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    } else {
      const res = await fetch(`${BASE_URL}/${url}`);
      return res.json();
    }
  }

  async totalSupply() {
    return this.mockTotalSupply;
  }

  async decimals() {
    return this.mockDecimals;
  }

  async tokenData() {
    return this.performFetch("data");
  }

  async balanceOf(address: string): Promise<BigNumber> {
    const decimals = await this.decimals();
    const res = await this.performFetch("balance");
    return new BigNumber(addDecimal(new BigNumber(res), decimals));
  }

  approve(address: string, spender: string): PromiEvent {
    return promiEventFactory(uuidv4(), "approve");
  }

  async allowance(address: string): Promise<BigNumber> {
    const res = await this.performFetch("allowance");
    return new BigNumber(addDecimal(new BigNumber(res), this.mockDecimals));
  }
}

export default MockedToken;
