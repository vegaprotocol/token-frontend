import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import lpStakeAbi from "../abis/lp_staking_abi.json";
import erc20Abi from "../abis/erc20_abi.json";
import { PromiEvent } from "../web3-utils";
import { addDecimal, removeDecimal } from "../decimals";
/**
 * Example:
 * ```
 * const provider = new Web3.providers.HttpProvider(
 *   "https://ropsten.infura.io/v3/5aff9e61ad844bcf982d0d0c3f1d29f1"
 * );
 * const web3 = new Web3(provider);
 *
 * // Ropsten address
 * const contract = new VegaClaim(web3, "0xAf5dC1772714b2F4fae3b65eb83100f1Ea677b21")
 * contract.isCountryBlocked("US").then(console.log)
 * contract.isClaimValid({ claimCode: "0x...", expiry: 0, nonce: "0x00", account: "0x00" })
 * ```
 */
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

  async stakedBalance (account: string): Promise<string> {
    return addDecimal(new BigNumber(await this.contract.methods
      .total_staked_for_user(account)
      .call({ from: account })),
      await this.lpDecimals
    );
  }

  async rewardsBalance (account: string): Promise<string> {
    // COntract reverts if no stake is added
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

  async totalStaked (): Promise<string> {
    return addDecimal(new BigNumber(await this.contract.methods
      .total_staked()
      .call()),
      await this.lpDecimals
    );
  }

  async stake (amount: string, account: string): PromiEvent<void> {
    return this.contract.methods
      .stake(removeDecimal(new BigNumber(amount), await this.lpDecimals).toString())
      .send({ from: account });
  }

  async unstake (account: string): PromiEvent<void> {
    return this.contract.methods
      .unstake()
      .send({ from: account });
  }

  async lpAllowance (account: string): Promise<string> {

    return addDecimal(new BigNumber(await (await this.lpContract).methods
      .allowance(account, this.address)
      .call()),
      await this.lpDecimals
    );
  }
}
