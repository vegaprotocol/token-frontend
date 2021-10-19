import { BigNumber } from "../../lib/bignumber";
import { ethers } from "ethers";
import lpStakeAbi from "../abis/lp_staking_abi.json";
import erc20Abi from "../abis/erc20_abi.json";
import { EpochDetails, IVegaLPStaking, WrappedPromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";

export default class VegaLPStaking implements IVegaLPStaking {
  private contract: ethers.Contract;
  public readonly address: string;

  private lpContract: Promise<ethers.Contract>;
  private lpDecimals: Promise<number>;

  private awardContract: Promise<ethers.Contract>;
  private awardDecimals: Promise<number>;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer,
    lpStakeAddress: string
  ) {
    this.address = lpStakeAddress;
    this.contract = new ethers.Contract(
      lpStakeAddress,
      lpStakeAbi as any,
      signer || provider
    );

    // Workaround for TS data-flow analysis
    const self = this;

    // These are all "memoized"
    this.lpContract = (async (): Promise<ethers.Contract> => {
      const lpTokenAddress = await self.contract.trusted_lp_token();

      return new ethers.Contract(lpTokenAddress, erc20Abi as any, provider);
    })();

    this.lpDecimals = (async (): Promise<number> => {
      return parseFloat(await (await self.lpContract).decimals());
    })();

    this.awardContract = (async (): Promise<ethers.Contract> => {
      const awardTokenAddress = await self.contract.trusted_reward_token();

      return new ethers.Contract(awardTokenAddress, erc20Abi as any, provider);
    })();

    this.awardDecimals = (async (): Promise<number> => {
      return parseFloat(await (await self.awardContract).decimals());
    })();
  }

  currentEpoch(): Promise<string> {
    return this.contract.get_current_epoch_number();
  }

  stakingStart(): Promise<string> {
    return this.contract.staking_start();
  }

  async currentEpochDetails(): Promise<EpochDetails> {
    const id = await this.currentEpoch();
    const startSeconds = await this.contract.staking_start();
    const epochSeconds = await this.contract.epoch_seconds();
    const res = {
      id,
      startSeconds: new BigNumber(startSeconds).plus(
        new BigNumber(id).times(epochSeconds)
      ),
      endSeconds: new BigNumber(startSeconds).plus(
        new BigNumber(id).plus(1).times(epochSeconds)
      ),
    };

    return res;
  }

  /**
   * Retrieve staked VEGA LP tokens for a given account
   * @param  {string}          account ethereum address
   * @return {Promise<BigNumber>}         balance in VEGA LP tokens as decimal number
   */
  async stakedBalance(account: string): Promise<{
    pending: BigNumber;
    earningRewards: BigNumber;
    total: BigNumber;
  }> {
    const user = await this.contract.users(account);
    const currentEpoch = await this.currentEpoch();
    const isPending = currentEpoch === user.last_epoch_withdrawn;
    const value = await this.contract.total_staked_for_user(account);
    const total = new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
    return isPending
      ? {
          pending: total,
          earningRewards: new BigNumber(0),
          total,
        }
      : {
          earningRewards: total,
          pending: new BigNumber(0),
          total,
        };
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
      const value = await this.contract.get_available_reward(account);
      return new BigNumber(
        addDecimal(new BigNumber(value), await this.awardDecimals)
      );
    } catch (e: any) {
      return new BigNumber(0);
    }
  }

  async awardContractAddress() {
    const awardContract = await this.awardContract;
    console.log(awardContract);
    // @ts-ignore // Contract._address is private
    return awardContract._address as string;
  }

  async slpContractAddress() {
    const lpContract = await this.lpContract;
    console.log(lpContract);
    // @ts-ignore // Contract._address is private
    return lpContract._address as string;
  }

  async rewardPerEpoch(): Promise<BigNumber> {
    const rewardPerEpoch = await this.contract.epoch_reward();
    const decimals = await this.awardDecimals;
    return new BigNumber(addDecimal(new BigNumber(rewardPerEpoch), decimals));
  }

  async liquidityTokensInRewardPool(): Promise<BigNumber> {
    const lpContract = await this.lpContract;
    const decimals = await this.awardDecimals;
    const balance = await lpContract.balanceOf(this.address);
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
      this.contract.epoch_reward(),
      this.contract.epoch_seconds(),
      this.contract.total_staked(),
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
    const value = await this.contract.total_staked();
    return new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
  }

  async totalUnstaked(account: string): Promise<BigNumber> {
    const lpTokenContract = await this.lpContract;
    const lpTokenDecimals = await this.lpDecimals;
    const value = await lpTokenContract.balanceOf(account);
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
  async stake(amount: string): Promise<WrappedPromiEvent<boolean>> {
    const decimals = await this.lpDecimals;
    return this.contract.stake(
      removeDecimal(new BigNumber(amount), decimals).toString()
    );
  }

  /**
   * Unstake the full amount and receive rewards.
   * @param  {string}           account address
   * @return {WrappedPromiEvent<void>}
   */
  unstake(): WrappedPromiEvent<void> {
    return this.contract.unstake();
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
    const value = await (
      await this.lpContract
    ).allowance(account, this.address);
    return new BigNumber(
      addDecimal(new BigNumber(value), await this.lpDecimals)
    );
  }

  withdrawRewards(): WrappedPromiEvent<void> {
    return this.contract.withdraw_rewards();
  }

  async approve(spender: string): Promise<any> {
    const amount = removeDecimal(
      new BigNumber(Number.MAX_SAFE_INTEGER),
      await this.lpDecimals
    );
    const contract = await this.lpContract;
    contract.approve(spender, amount);
  }
}
