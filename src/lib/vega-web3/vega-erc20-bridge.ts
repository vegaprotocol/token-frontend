import { ethers } from "ethers";
import { IVegaErc20Bridge } from "../web3-utils";
import erc20BridgeAbi from "../abis/erc20_bridge_abi.json";

export class VegaErc20Bridge implements IVegaErc20Bridge {
  private contract: ethers.Contract;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer | null,
    address: string
  ) {
    console.log(address);
    this.contract = new ethers.Contract(
      address,
      erc20BridgeAbi,
      signer || provider
    );
  }

  withdraw(approval: {
    assetSource: string;
    amount: string;
    expiry: string;
    nonce: string;
    signatures: string;
    targetAddress: string;
  }): Promise<ethers.ContractTransaction> {
    return this.contract.withdraw_asset(
      approval.assetSource,
      approval.amount, // No need to remove decimals as this value is already set and not manipulated by the user
      approval.expiry,
      approval.targetAddress,
      approval.nonce,
      approval.signatures
    );
  }
}
