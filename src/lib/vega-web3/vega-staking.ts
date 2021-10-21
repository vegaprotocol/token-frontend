import { BigNumber } from "../../lib/bignumber";
import BN from "bn.js";
import { ethers } from "ethers";
import stakingAbi from "../abis/staking_abi.json";
import { IVegaStaking } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class StakingAbi implements IVegaStaking {
  private contract: ethers.Contract;
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer,
    address: string,
    decimals: number
  ) {
    this.contract = new ethers.Contract(
      address,
      stakingAbi,
      signer || provider
    );
    this.decimals = decimals;
  }

  addStake(
    amount: string,
    vegaKey: string
  ): Promise<ethers.ContractTransaction> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.stake(convertedAmount, `0x${vegaKey}`);
  }

  removeStake(
    amount: string,
    vegaKey: string
  ): Promise<ethers.ContractTransaction> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.remove_stake(convertedAmount, `0x${vegaKey}`);
  }

  transferStake(
    amount: string,
    newAddress: string,
    vegaKey: string
  ): Promise<ethers.ContractTransaction> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.transfer_stake(
      convertedAmount,
      newAddress,
      `0x${vegaKey}`
    );
  }

  async stakeBalance(address: string, vegaKey: string): Promise<BigNumber> {
    const res: BN = await this.contract.stake_balance(address, `0x${vegaKey}`);
    return new BigNumber(
      addDecimal(new BigNumber(res.toString()), this.decimals)
    );
  }

  async totalStaked(): Promise<BigNumber> {
    const res: BN = await this.contract.total_staked();
    return new BigNumber(
      addDecimal(new BigNumber(res.toString()), this.decimals)
    );
  }

  async userTotalStakedByVegaKey(address: string) {
    const lookup: { [vegaKey: string]: BigNumber } = {};
    const addFilter = this.contract.filters.Stake_Deposited(address);
    const removeFilter = this.contract.filters.Stake_Removed(address);
    const addEvents = await this.contract.queryFilter(addFilter);
    const removeEvents = await this.contract.queryFilter(removeFilter);
    const parseAmount = (e: ethers.Event) => {
      const rawAmount = new BigNumber(e.args?.amount.toString() || 0);
      return new BigNumber(addDecimal(rawAmount, this.decimals));
    };

    addEvents.forEach((e) => {
      const vegaKey = e.args?.vega_public_key;
      const amount = parseAmount(e);

      if (!vegaKey) return;
      if (lookup.hasOwnProperty(vegaKey)) {
        // Add amount to current value
        lookup[vegaKey] = lookup[vegaKey].plus(amount);
      } else {
        // Create new entry
        lookup[vegaKey] = amount;
      }
    });

    removeEvents.forEach((e) => {
      const vegaKey = e.args?.vega_public_key;
      const amount = parseAmount(e);

      if (!vegaKey) return;
      if (lookup.hasOwnProperty(vegaKey)) {
        // Add amount to current value
        lookup[vegaKey] = lookup[vegaKey].minus(amount);
      } else {
        // Minus off zero, this probably shouldn't ever happen
        lookup[vegaKey] = new BigNumber(0).minus(amount);
      }
    });

    return lookup;
  }
}
