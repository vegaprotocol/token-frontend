import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import lpStakeAbi from "../abis/lp_staking_abi.json";
import erc20Abi from "../abis/erc20_abi.json";
import { PromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class VegaLPStaking {
  private web3: Web3;
  private contract: Contract;
  public readonly address: string;

  private lpContract: Promise<Contract>;
  private lpDecimals: Promise<number>;

  private awardContract: Promise<Contract>;
  private awardDecimals: Promise<number>;


  constructor(web3: Web3, lpStakeAddress: string) {
    this.web3 = web3;
    this.address = lpStakeAddress;
    this.contract = new this.web3.eth.Contract(
      lpStakeAbi as AbiItem[],
      lpStakeAddress
    );

    // Workaround for TS data-flow analysis
    const self = this;

    // These are all "memoized"
    this.lpContract = (async (): Promise<Contract> => {
      const lpTokenAddress = await self.contract.methods
        .lp_token_address()
        .call();

      return new self.web3.eth.Contract(
        erc20Abi as AbiItem[],
        lpTokenAddress
      );
    })();

    this.lpDecimals = (async (): Promise<number> => {
      return parseFloat(await (await self.lpContract).methods
              .decimals()
              .call());
    })();

    this.awardContract = (async (): Promise<Contract> => {
      const awardTokenAddress = await self.contract.methods
        .award_token_address()
        .call();

      return new self.web3.eth.Contract(
        erc20Abi as AbiItem[],
        awardTokenAddress
      );
    })();

    this.awardDecimals = (async (): Promise<number> => {
      return parseFloat(await (await self.awardContract).methods
              .decimals()
              .call());
    })();
  }

  /**
   * Retrieve staked VEGA LP tokens for a given account
   * @param  {string}          account ethereum address
   * @return {Promise<string>}         balance in VEGA LP tokens as decimal number
   */
  async stakedBalance (account: string): Promise<string> {
    return addDecimal(new BigNumber(await this.contract.methods
      .total_staked_for_user(account)
      .call({ from: account })),
      await this.lpDecimals
    );
  }

  /**
   * Retrieve the current accumulated rewards denominated in the reward tokens'
   * unit. This will be zero when nothing is staked or until one epoch has
   * passed.
   *
   * @param  {string}          account address
   * @return {Promise<string>}         Reward token balance in units
   */
  async rewardsBalance (account: string): Promise<string> {
    // Contract reverts if no stake is added
    try {
      return addDecimal(new BigNumber(await this.contract.methods
        .get_available_reward(account)
        .call({ from: account })),
        await this.awardDecimals
      );
    } catch {
      return '0';
    }
  }

  /**
   * Estimated APY. Note that this number may flucutate a lot and will decrease
   * with each staking, including what the user may want to stake.
   * When nothing is stake the APY will be Infinity, while after that it will be
   * a decimal number (not percent).
   * @return {Promise<BigNumber>} APY as a decimal number. See above caveats
   */
  async estimateAPY (): Promise<BigNumber> {
    const [epochReward, epochInterval, totalBalance] = await Promise.all([
      this.contract.methods.epoch_reward().call(),
      this.contract.methods.epoch_seconds().call(),
      this.contract.methods.total_staked().call()
    ]);

    const epochsPerYear = new BigNumber(60 * 60 * 24 * 365).dividedBy(epochInterval);
    const epochRoi = new BigNumber(epochReward).dividedBy(totalBalance);

    return epochRoi.multipliedBy(epochsPerYear);
  }

  /**
   * Total amount staked in this liquidity pool
   * @return {Promise<string>} Amount in VEGA LP units
   */
  async totalStaked (): Promise<string> {
    return addDecimal(new BigNumber(await this.contract.methods
      .total_staked()
      .call()),
      await this.lpDecimals
    );
  }

  /**
   * Stake action. Note that the user must have called `.approve` on the VEGA LP
   * contract before this can be invoked. The allowance can be checked with
   * `.lpAllowance(account)`. Staking cannot be topped up. To change stake,
   * first `.unstake(account)` must be called, before another staking can take
   * place.
   *
   * @param  {string}           amount  stake in VEGA LP units
   * @param  {string}           account address
   * @return {PromiEvent<void>}
   */
  async stake (amount: string, account: string): PromiEvent<void> {
    return this.contract.methods
      .stake(removeDecimal(new BigNumber(amount), await this.lpDecimals).toString())
      .send({ from: account });
  }

  /**
   * Unstake the full amount and receive rewards.
   * @param  {string}           account address
   * @return {PromiEvent<void>}
   */
  async unstake (account: string): PromiEvent<void> {
    return this.contract.methods
      .unstake()
      .send({ from: account });
  }

  /**
   * Retrieve the VEGA LP allowance that the staking contract can maximum
   * withdraw. This number must be greater than or equal to any amount passed
   * to `.stake(amount, account)`. The amount is returned as a decimal number of
   * VEGA LP tokens
   * @param  {string}          account address
   * @return {Promise<string>}
   */
  async lpAllowance (account: string): Promise<string> {
    return addDecimal(new BigNumber(await (await this.lpContract).methods
      .allowance(account, this.address)
      .call()),
      await this.lpDecimals
    );
  }
}
