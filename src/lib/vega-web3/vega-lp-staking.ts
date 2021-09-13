import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import lpStakeAbi from "../abis/lp_staking_abi.json";
import erc20Abi from "../abis/erc20_abi.json";
import { IVegaLPStaking, WrappedPromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class VegaLPStaking implements IVegaLPStaking {
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

      return new self.web3.eth.Contract(erc20Abi as AbiItem[], lpTokenAddress);
    })();

    this.lpDecimals = (async (): Promise<number> => {
      return parseFloat(
        await (await self.lpContract).methods.decimals().call()
      );
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
      return parseFloat(
        await (await self.awardContract).methods.decimals().call()
      );
    })();
  }

  /**
   * Retrieve staked VEGA LP tokens for a given account
   * @param  {string}          account ethereum address
   * @return {Promise<BigNumber>}         balance in VEGA LP tokens as decimal number
   */
  async stakedBalance(account: string): Promise<BigNumber> {
    const value = await this.contract.methods
      .total_staked_for_user(account)
      .call({ from: account });
    return new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
  }

  /**
   * Retrieve the current accumulated rewards denominated in the reward tokens'
   * unit. This will be zero when nothing is staked or until one epoch has
   * passed.
   *
   * @param  {string}          account address
   * @return {Promise<BigNumber>}         Reward token balance in units
   */
  async rewardsBalance(account: string): Promise<BigNumber> {
    // Contract reverts if no stake is added, resulting in the catch block
    // being run. Just return 0 if thats the case
    try {
      const value = await this.contract.methods
        .get_available_reward(account)
        .call();
      return new BigNumber(
        addDecimal(new BigNumber(value), await this.awardDecimals)
      );
    } catch (e: any) {
      return new BigNumber(0);
    }
  }

  async awardContractAddress() {
    const awardContract = await this.awardContract;
    // @ts-ignore // Contract._address is private
    return awardContract._address as string;
  }

  async rewardPerEpoch(): Promise<BigNumber> {
    const rewardPerEpoch = await this.contract.methods.epoch_reward().call();
    const decimals = await this.awardDecimals;
    return new BigNumber(addDecimal(new BigNumber(rewardPerEpoch), decimals));
  }

  async liquidityTokensInRewardPool(): Promise<BigNumber> {
    const lpContract = await this.lpContract;
    const decimals = await this.awardDecimals;
    const balance = await lpContract.methods.balanceOf(this.address).call();
    return new BigNumber(addDecimal(new BigNumber(balance), decimals));
  }

  /**
   * Estimated APY. Note that this number may flucutate a lot and will decrease
   * with each staking, including what the user may want to stake.
   * When nothing is stake the APY will be Infinity, while after that it will be
   * a decimal number (not percent).
   * @return {Promise<BigNumber>} APY as a decimal number. See above caveats
   */
  async estimateAPY(): Promise<BigNumber> {
    const [epochReward, epochInterval, totalBalance] = await Promise.all([
      this.contract.methods.epoch_reward().call(),
      this.contract.methods.epoch_seconds().call(),
      this.contract.methods.total_staked().call(),
    ]);

    // If there is none staked the APY is 0, not infinity
    if (new BigNumber(totalBalance).isEqualTo(0)) {
      return new BigNumber(0);
    }

    const epochsPerYear = new BigNumber(60 * 60 * 24 * 365).dividedBy(
      epochInterval
    );
    const epochApy = new BigNumber(epochReward).dividedBy(totalBalance);

    return epochApy.multipliedBy(epochsPerYear).times(100);
  }

  /**
   * Total amount staked in this liquidity pool
   * @return {Promise<BigNumber>} Amount in VEGA LP units
   */
  async totalStaked(): Promise<BigNumber> {
    const value = await this.contract.methods.total_staked().call();
    return new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
  }

  async totalUnstaked(account: string): Promise<BigNumber> {
    const lpTokenContract = await this.lpContract;
    const lpTokenDecimals = await this.lpDecimals;
    const value = await lpTokenContract.methods.balanceOf(account).call();
    return new BigNumber(addDecimal(new BigNumber(value), lpTokenDecimals));
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
   * @return {Promise<WrappedPromiEvent<boolean>>}
   */
  async stake(
    amount: string,
    account: string
  ): Promise<WrappedPromiEvent<boolean>> {
    const decimals = await this.lpDecimals;
    return {
      promiEvent: this.contract.methods
        .stake(removeDecimal(new BigNumber(amount), decimals).toString())
        .send({ from: account }),
    };
  }

  /**
   * Unstake the full amount and receive rewards.
   * @param  {string}           account address
   * @return {WrappedPromiEvent<void>}
   */
  unstake(account: string): WrappedPromiEvent<void> {
    return {
      promiEvent: this.contract.methods.unstake().send({ from: account }),
    };
  }

  /**
   * Retrieve the VEGA LP allowance that the staking contract can maximum
   * withdraw. This number must be greater than or equal to any amount passed
   * to `.stake(amount, account)`. The amount is returned as a decimal number of
   * VEGA LP tokens
   * @param  {string}          account address
   * @return {Promise<BigNumber>}
   */
  async allowance(account: string): Promise<BigNumber> {
    const value = await (await this.lpContract).methods
      .allowance(account, this.address)
      .call();
    return new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
  }

  async approve(
    address: string,
    spender: string
  ): Promise<WrappedPromiEvent<boolean>> {
    const amount = removeDecimal(
      new BigNumber(Number.MAX_SAFE_INTEGER),
      await this.lpDecimals
    );
    const contract = await this.lpContract;
    return contract.methods.approve(spender, amount).send({ from: address });
  }
}
