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

  async stakedBalance(account: string): Promise<string> {
    return addDecimal(
      new BigNumber(
        await this.contract.methods
          .total_staked_for_user(account)
          .call({ from: account })
      ),
      await this.lpDecimals
    );
  }

  async rewardsBalance(account: string): Promise<string> {
    // Contract reverts if no stake is added, resulting in the catch block
    // being run. Just return 0 if thats the case
    try {
      return addDecimal(
        new BigNumber(
          await this.contract.methods.get_available_reward(account).call()
        ),
        await this.awardDecimals
      );
    } catch (e: any) {
      return "0";
    }
  }

  async awardContractAddress() {
    const awardContract = await this.awardContract;
    // @ts-ignore // Contract._address is private
    return awardContract._address;
  }

  async rewardPerEpoch(): Promise<string> {
    const rewardPerEpoch = await this.contract.methods.epoch_reward().call();
    const decimals = await this.awardDecimals;
    return addDecimal(new BigNumber(rewardPerEpoch), decimals);
  }

  async liquidityTokensInRewardPool() {
    const rewardContract = await this.awardContract;
    const decimals = await this.awardDecimals;
    const balance = await rewardContract.methods.balanceOf(this.address).call();
    return addDecimal(new BigNumber(balance), decimals);
  }

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
    const epochRoi = new BigNumber(epochReward).dividedBy(totalBalance);

    return epochRoi.multipliedBy(epochsPerYear);
  }

  async totalStaked(): Promise<string> {
    return addDecimal(
      new BigNumber(await this.contract.methods.total_staked().call()),
      await this.lpDecimals
    );
  }

  async totalUnstaked(account: string): Promise<string> {
    const lpTokenContract = await this.lpContract;
    const lpTokenDecimals = await this.lpDecimals;
    const value = await lpTokenContract.methods.balanceOf(account).call();
    return addDecimal(new BigNumber(value), lpTokenDecimals);
  }

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

  unstake(account: string): WrappedPromiEvent<void> {
    return {
      promiEvent: this.contract.methods.unstake().send({ from: account }),
    };
  }

  async allowance(account: string): Promise<string> {
    return addDecimal(
      new BigNumber(
        await (await this.lpContract).methods
          .allowance(account, this.address)
          .call()
      ),
      await this.lpDecimals
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
