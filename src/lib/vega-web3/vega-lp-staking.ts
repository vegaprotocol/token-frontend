import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import lpStakeAbi from "../abis/claim_abi.json";
import { PromiEvent } from "../web3-utils";

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

  constructor(web3: Web3, lpStakeAddress: string) {
    this.web3 = web3;
    this.address = lpStakeAddress;
    this.contract = new this.web3.eth.Contract(
      lpStakeAbi as AbiItem[],
      lpStakeAddress
    );
  }

  async stakedBalance (account: String): Promise<BigNumber> {
    return this.contract.methods
      .total_staked_for_user(account)
      .call({ from: account });
  }

  async rewardsBalance (account: String): Promise<BigNumber> {
    return this.contract.methods
      .get_available_reward(account)
      .call({ from: account });
  }

  async estimateAPY (): Promise<BigNumber> {
    const [epochReward, epochInterval, totalBalance] = await Promise.all([
      this.contract.methods.epoch_reward().call(),
      this.contract.methods.epoch_seconds().call(),
      this.contract.methods.total_staked().call()
    ])

    const epochsPerYear = new BigNumber(60 * 60 * 24 * 365).dividedBy(epochInterval)
    const epochRoi = epochReward.dividedBy(totalBalance)

    return epochRoi.mul(epochsPerYear)
  }

  async stake (amount: BigNumber, account: String) {
    // TODO: Call approve on IERC20(lp_token_address) ?
    return this.contract.methods
      .stake(amount)
      .send({ from: account })
  }

  async unstake (account: String) {
    return this.contract.methods
      .unstake()
      .send({ from: account })
  }
}
