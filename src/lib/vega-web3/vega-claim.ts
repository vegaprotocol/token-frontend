import Web3 from "web3";
import type { Contract } from "web3-eth-contract";
import claimAbi from "../abis/claim_abi.json";
import { BigNumber } from "../bignumber";

export type PromiEvent = typeof Promise & {
  on: (event: string, listener: (...args: any[]) => void) => PromiEvent;
  once: (event: string, listener: (...args: any[]) => void) => PromiEvent;
};

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
export default class VegaClaim {
  private web3: Web3;
  private contract: Contract;

  constructor(web3: Web3, claimAddress: string) {
    this.web3 = web3;
    this.contract = new this.web3.eth.Contract(
      // @ts-ignore
      claimAbi,
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
  public commit(claimCode: string, account: string): PromiEvent {
    const hash = this.deriveCommitment(claimCode, account);

    return this.contract.methods
      .commit_untargeted_code(hash)
      .send({ from: account });
  }

  public checkCommit(claimCode: string, account: string): Promise<any> {
    const hash = this.deriveCommitment(claimCode, account);

    return this.contract.methods
      .commit_untargeted_code(hash)
      .call({ from: account });
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
  }): PromiEvent {
    return this.contract.methods[
      targeted ? "redeem_targeted" : "redeem_untargeted_code"
    ](
      claimCode,
      denomination.toString(),
      trancheId,
      expiry,
      nonce,
      Web3.utils.asciiToHex(country)
    ).send({ from: account });
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
    return this.contract.methods[
      targeted ? "redeem_targeted" : "redeem_untargeted_code"
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
  async isCommitted({
    claimCode,
    account,
  }: {
    claimCode: string;
    account: string;
  }): Promise<boolean> {
    const hash = this.deriveCommitment(claimCode, account);

    return await this.contract.methods.commits(hash).call();
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
  isUsed(nonce: string): Promise<boolean> {
    return this.contract.methods.nonces(nonce).call();
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

  /**
   * Utility method to derive the commitment hash from code and account
   * @param  {string} claimCode
   * @param  {string} account
   * @return {string}
   */
  deriveCommitment(claimCode: string, account: string): string {
    // FIXME: Consider direct soliditySha3Raw if the contract changes encoding
    // @ts-ignore
    return this.web3.utils.sha3Raw(
      this.web3.eth.abi.encodeParameters(
        ["bytes", "address"],
        [claimCode, account]
      )
    );
  }
}
