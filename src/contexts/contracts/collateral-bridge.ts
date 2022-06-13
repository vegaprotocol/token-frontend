import {
  addDecimal,
  EnvironmentConfig,
  Networks,
} from "@vegaprotocol/smart-contracts-sdk";
import BigNumber from "bignumber.js";
import { BigNumber as EthersBigNumber, ethers } from "ethers";

import abi from "./collateral-bridge-abi.json";

export class CollateralBridge {
  private contract: ethers.Contract;

  constructor(
    network: Networks,
    provider: ethers.providers.Web3Provider,
    signer?: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      EnvironmentConfig[network].erc20Bridge,
      abi,
      signer || provider
    );
  }

  /** Executes contracts withdraw_asset function */
  withdraw(approval: {
    assetSource: string;
    amount: string;
    creation: string;
    nonce: string;
    signatures: string;
    targetAddress: string;
  }): Promise<ethers.ContractTransaction> {
    return this.contract.withdraw_asset(
      approval.assetSource,
      approval.amount, // No need to remove decimals as this value is already set and not manipulated by the user
      approval.targetAddress,
      approval.creation,
      approval.nonce,
      approval.signatures
    );
  }

  async depositAsset(
    assetSource: string,
    amount: string,
    vegaPublicKey: string
  ) {
    const tx = await this.contract.deposit_asset(
      assetSource,
      amount,
      vegaPublicKey
    );

    return tx;
  }

  async getAssetSource(vegaAssetId: string): Promise<string> {
    const res = await this.contract.get_asset_source(vegaAssetId);
    return res;
  }

  async getDepositMaximum(
    assetSource: string,
    decimals: number
  ): Promise<BigNumber> {
    const res: EthersBigNumber =
      await this.contract.get_asset_deposit_lifetime_limit(assetSource);
    const value = addDecimal(new BigNumber(res.toString()), decimals);
    return value;
  }

  async getMultisigControlAddress(): Promise<string> {
    const res = await this.contract.get_multisig_control_address();
    return res;
  }

  async getVegaAssetId(): Promise<string> {
    const res = await this.contract.get_vega_asset_id();
    return res;
  }

  async isAssetListed(assetSource: string): Promise<boolean> {
    const res = await this.contract.is_asset_listed(assetSource);
    return res;
  }
}
