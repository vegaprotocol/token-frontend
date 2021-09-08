import { BigNumber } from "../../bignumber";
import { IVegaStaking, PromiEvent } from "../../web3-utils";
import { promiEventFactory, uuidv4 } from "./promi-manager";
import Web3 from "web3";
import { addDecimal } from "../../decimals";

const BASE_URL = "mocks/staking";

class MockedVegaStaking implements IVegaStaking {
  private decimals: number;

  constructor(web3: Web3, vestingAddress: string, decimals: number) {
    this.decimals = decimals;
  }
  checkRemoveStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    return Promise.resolve(true);
  }
  checkAddStake(
    address: string,
    amount: string,
    vegaKey: string
  ): Promise<any> {
    return Promise.resolve(true);
  }
  checkTransferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<any> {
    return Promise.resolve(true);
  }
  addStake(address: string, amount: string, vegaKey: string): PromiEvent<void> {
    return promiEventFactory(uuidv4(), "add-stake");
  }
  removeStake(address: string, amount: string, vegaKey: string): PromiEvent<void> {
    return promiEventFactory(uuidv4(), "remove-stake");
  }
  transferStake(
    address: string,
    amount: string,
    newAddress: string,
    vegaKey: string
  ): PromiEvent<void> {
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
