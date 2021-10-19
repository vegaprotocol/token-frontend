import { BigNumber } from "../../lib/bignumber";
import BN from "bn.js";
import { ethers } from "ethers";
import { AbiItem } from "web3-utils";
import vestingAbi from "../abis/vesting_abi.json";
import { IVegaVesting } from "../web3-utils";
import { getTranchesFromHistory } from "./tranche-helpers";
import { Tranche } from "./vega-web3-types";
import { addDecimal, removeDecimal } from "../decimals";
import { ADDRESSES } from "../../config";

// @ts-ignore
export default class VegaVesting implements IVegaVesting {
  private provider: ethers.providers.Web3Provider;
  private contract: ethers.Contract;
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: any,
    vestingAddress: string,
    decimals: number
  ) {
    this.decimals = decimals;
    this.provider = provider;
    this.contract = new ethers.Contract(
      vestingAddress,
      // @ts-ignore
      vestingAbi as AbiItem[],
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

  removeStake(amount: string, vegaKey: string): Promise<any> {
    const convertedAmount = removeDecimal(
      new BigNumber(amount),
      this.decimals
    ).toString();
    return this.contract.remove_stake(convertedAmount, `0x${vegaKey}`);
  }

  addStake(amount: string, vegaKey: string): Promise<any> {
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
    const createEvents = await this.contract.queryFilter(
      this.contract.filters.Tranche_Created()
    );
    const addEvents = await this.contract.queryFilter(
      this.contract.filters.Tranche_Balance_Added()
    );
    const removeEvents = await this.contract.queryFilter(
      this.contract.filters.Tranche_Balance_Removed()
    );
    return getTranchesFromHistory(
      createEvents,
      addEvents,
      removeEvents,
      this.decimals
    );
  }

  withdrawFromTranche(account: string, trancheId: number): Promise<any> {
    return this.contract.withdraw_from_tranche(trancheId);
  }
}
