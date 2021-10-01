import { BigNumber } from "../../lib/bignumber";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import claimAbi from "../abis/claim_abi.json";
import { IVegaClaim, WrappedPromiEvent } from "../web3-utils";

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
export default class VegaClaim implements IVegaClaim {
  private web3: Web3;
  private contract: Contract;

  constructor(web3: Web3, claimAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      claimAbi as AbiItem[],
      claimAddress
    );
  }

  /**
   * Commit to an untargeted claim code. This step is important to prevent
   * someone frontrunning the user in the mempool and stealing their claim.
   * This transaction MUST be mined before attempting to claim the code after,
   * otherwise the action is pointless
   * @return {Promise<boolean>}
   */
  public commit(s: string, account: string): WrappedPromiEvent<void> {
    return {
      promiEvent: this.contract.methods
        .commit_untargeted(s)
        .send({ from: account }),
    };
  }

  public checkCommit(s: string, account: string): Promise<any> {
    return this.contract.methods.commit_untargeted(s).call({ from: account });
  }

  /**
   * Perform the final claim. Automatically switches between targeted and
   * untargeted claims. However, for untargeted ones, it's assumed that commit
   * was performed and mined beforehand
   * @return {Promise<boolean>}
   */
  public claim({
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country,
    targeted,
    account,
  }: {
    claimCode: string;
    denomination: BigNumber;
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): WrappedPromiEvent<void> {
    // TODO how do I send args as tuple?
    return {
      promiEvent: this.contract.methods[
        targeted ? "claim_targeted" : "claim_untargeted"
      ](
        claimCode,
        denomination.toString(),
        trancheId,
        expiry,
        nonce,
        Web3.utils.asciiToHex(country)
      ).send({ from: account }),
    };
  }

  public checkClaim({
    claimCode,
    denomination,
    trancheId,
    expiry,
    nonce,
    country,
    targeted,
    account,
  }: {
    claimCode: string;
    denomination: BigNumber;
    trancheId: number;
    expiry: number;
    nonce: string;
    country: string;
    targeted: boolean;
    account: string;
  }): Promise<any> {
    // TODO how do I send args as tuple?
    return this.contract.methods[
      targeted ? "claim_targeted" : "claim_untargeted"
    ](
      claimCode,
      denomination.toString(),
      trancheId,
      expiry,
      nonce,
      Web3.utils.asciiToHex(country)
    ).call({ from: account });
  }

  /**
   * Check if this code was already committed to by this account
   * @return {Promise<boolean>}
   */
  async isCommitted({ account }: { account: string }): Promise<boolean> {
    return (await this.contract.methods.commitments(account).call()) === "0x0";
  }

  /**
   * Checks if a code is passed its' expiry date
   * @param expiry Expiry of the code
   * @returns Promise<boolean>
   */
  async isExpired(expiry: number): Promise<boolean> {
    return (
      expiry > 0 && expiry < (await this.web3.eth.getBlock("latest")).timestamp
    );
  }

  /**
   * Utility method to check if the nonce has already been used. If it has the code has already been claimed.
   * @param nonce The nonce of the code
   * @return {string}
   */
  async isUsed(account: string): Promise<boolean> {
    return (await this.contract.methods.commitments(account).call()) === "0x1";
  }

  /**
   * Check if country is blocked. country must be the two letter ISO code
   * @param  {string}           country 2 letter ISO code
   * @return {Promise<boolean>}
   */
  async isCountryBlocked(country: string): Promise<boolean> {
    const isAllowed = await this.contract.methods
      .allowed_countries(Web3.utils.asciiToHex(country))
      .call();
    return !isAllowed;
  }
}
