import { ethers } from "ethers";
import { BigNumber } from "../../bignumber";
import { IVegaStaking } from "../../web3-utils";
import { promiEventFactory, uuidv4 } from "./promi-manager";
import { addDecimal } from "../../decimals";

const BASE_URL = "mocks/staking";

class MockedVegaStaking implements IVegaStaking {
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer,
    vestingAddress: string,
    decimals: number
  ) {
    this.decimals = decimals;
  }

  addStake(amount: string, vegaKey: string): Promise<void> {
    // @ts-ignore
    return promiEventFactory(uuidv4(), "add-stake");
  }

  removeStake(amount: string, vegaKey: string): Promise<any> {
    // @ts-ignore
    return promiEventFactory(uuidv4(), "remove-stake");
  }

  transferStake(
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any> {
    // @ts-ignore
    return promiEventFactory(uuidv4(), "transfer-stake");
  }

  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    const res = await this.performFetch("balance");
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }

  async totalStaked(): Promise<BigNumber> {
    const res = await this.performFetch("balance/total");
    return new BigNumber(addDecimal(new BigNumber(res), this.decimals));
  }

  private async performFetch(url: string, data?: any) {
    const res = await fetch(`${BASE_URL}/${url}`);
    return res.json();
  }
}

export default MockedVegaStaking;
