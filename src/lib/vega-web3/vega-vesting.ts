import { BigNumber } from "../../lib/bignumber";
import BN from "bn.js";
import { ethers } from "ethers";
import vestingAbi from "../abis/vesting_abi.json";
import { IVegaVesting } from "../web3-utils";
import { getTranchesFromHistory } from "./tranche-helpers";
import { Tranche } from "./vega-web3-types";
import { addDecimal, removeDecimal } from "../decimals";

export default class VegaVesting implements IVegaVesting {
  private contract: ethers.Contract;
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer,
    vestingAddress: string,
    decimals: number
  ) {
    this.decimals = decimals;
    this.contract = new ethers.Contract(
      vestingAddress,
      vestingAbi,
      signer || provider
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

  addStake(
    amount: string,
    vegaKey: string
  ): Promise<ethers.ContractTransaction> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.stake_tokens(convertedAmount, `0x${vegaKey}`);
  }

  async getLien(address: string): Promise<BigNumber> {
    const { lien } = await this.contract.user_stats(address);
    return new BigNumber(
      addDecimal(
        new BigNumber(
          // lien is a bn.js bignumber convert back to bignumber.js
          lien.toString()
        ),
        this.decimals
      )
    );
  }

  async userTrancheTotalBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const amount: BN = await this.contract.get_tranche_balance(
      address,
      tranche
    );
    return new BigNumber(
      addDecimal(new BigNumber(amount.toString()), this.decimals)
    );
  }

  async userTrancheVestedBalance(
    address: string,
    tranche: number
  ): Promise<BigNumber> {
    const amount: BN = await this.contract.get_vested_for_tranche(
      address,
      tranche
    );
    return new BigNumber(
      addDecimal(new BigNumber(amount.toString()), this.decimals)
    );
  }

  async getUserBalanceAllTranches(account: string): Promise<BigNumber> {
    const amount: BN = await this.contract.user_total_all_tranches(account);
    return new BigNumber(
      addDecimal(new BigNumber(amount.toString()), this.decimals)
    );
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await Promise.all([
      this.contract.queryFilter(this.contract.filters.Tranche_Created()),
      this.contract.queryFilter(this.contract.filters.Tranche_Balance_Added()),
      this.contract.queryFilter(
        this.contract.filters.Tranche_Balance_Removed()
      ),
    ]);
    return getTranchesFromHistory(...events, this.decimals);
  }

  withdrawFromTranche(trancheId: number): Promise<ethers.ContractTransaction> {
    return this.contract.withdraw_from_tranche(trancheId);
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
