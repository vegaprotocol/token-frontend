import Web3 from "web3";
import type BN from "bn.js";
import type { Contract } from "web3-eth-contract";
import claimAbi from "./claim_abi.json";

type PromiEvent = typeof Promise & {
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
  commit(claimCode: string, account: string): PromiEvent {
    const hash = this.deriveCommitment(claimCode, account);

    return this.contract.methods
      .commit_untargeted_code(hash)
      .send({ from: account });
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
    denomination: BN;
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

  /**
   * Sanity checks whether a claim code is still valid.
   * Checks:
   *   1. Did this account already commit to this code (we cannot know if someone else did)
   *   2. Did the code expire, iff it has an expiry
   *   3. Has the nonce already been used
   *
   * @return {Promise<boolean>}
   */
  async isClaimValid({
    claimCode,
    nonce,
    expiry,
    account,
  }: {
    claimCode: string;
    nonce: string;
    expiry: number;
    account: string;
  }): Promise<boolean> {
    // We can only know for sure if this account performed the commitment

    // TODO remove this from this check, so we can check if the user is in an intermediate state
    if ((await this.isCommitted({ claimCode, account })) === true) return false;

    // Expiry rules from the contract. expiry === 0 means that it will never expire
    if (
      expiry > 0 &&
      expiry > (await this.web3.eth.getBlock("latest")).timestamp
    )
      return false;

    // nonces are stored in a map once used
    if ((await this.contract.methods.nonces(nonce).call()) === true)
      return false;

    return true;
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
   * Check if country is blocked. country must be the two letter ISO code
   * @param  {string}           country 2 letter ISO code
   * @return {Promise<boolean>}
   */
  async isCountryBlocked(country: string): Promise<boolean> {
    return this.contract.methods
      .blocked_countries(Web3.utils.asciiToHex(country))
      .call();
  }

  /**
   * Utility method to derive the commitment hash from code and account
   * @param  {string} claimCode
   * @param  {string} account
   * @return {string}
   */
  deriveCommitment(claimCode: string, account: string): string {
    return this.web3.utils.soliditySha3Raw(
      { type: "bytes", value: claimCode },
      { type: "address", value: account }
    );
  }
}
