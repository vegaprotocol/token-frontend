import { ethers } from "ethers";
import { IVegaErc20Bridge } from "../web3-utils";
import erc20BridgeAbi from "../abis/vesting_abi.json";

export class VegaErc20Bridge implements IVegaErc20Bridge {
  private provider: ethers.providers.Web3Provider;
  private contract: ethers.Contract;
  private decimals: number;

  constructor(
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer | null,
    address: string,
    decimals: number
  ) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      address,
      erc20BridgeAbi,
      signer || provider
    );
    this.decimals = decimals;
  }

  withdraw() {
    console.log("here!!");
    return Promise.resolve();
  }
}
