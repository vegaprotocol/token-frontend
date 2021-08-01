import type {
  ITokenParams,
  IVegaWeb3,
  Tranche,
} from "../vega-web3/vega-web3-types";
import { EthereumChainId } from "../web3-utils";
import { generateTranches } from "./generate-tranche";
import { PromiEvent } from "web3-core";
import VegaClaim from "../vega-web3/vega-claim";

class VegaWeb3 implements IVegaWeb3 {
  public chainId: EthereumChainId;
  public claim: VegaClaim;

  constructor(chainId: EthereumChainId) {
    this.chainId = chainId;
    // TODO fix this mock
    this.claim = {} as any;
  }

  async getAllTranches(): Promise<Tranche[]> {
    return Promise.resolve(generateTranches(10));
  }

  async getUserBalanceAllTranches() {
    return Promise.resolve("123");
  }

  async validateCode({
    nonce,
    trancheId,
    expiry,
    target,
    denomination,
    code,
  }: ITokenParams) {
    return Promise.resolve(true);
  }

  commitClaim(): PromiEvent<any> {
    const promiEvent = new MockPromiEvent();

    // start tx on next tick so that UI can update
    setTimeout(() => {
      const confirm = window.confirm("[TEST]: Confirm transaction");

      if (confirm) {
        promiEvent.trigger("transactionHash", "0xTEST_HASH");

        setTimeout(() => {
          promiEvent.trigger("receipt", { receipt: true });
        }, 1000);
      } else {
        promiEvent.trigger("error", new Error("user rejected"));
      }
    }, 0);

    // @ts-ignore
    return promiEvent;
  }
}

export class MockPromiEvent {
  events: { [event: string]: Array<Function> } = {};

  on(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event].push(callback);
    } else {
      this.events[event] = [callback];
    }
    return this;
  }

  trigger(event: string, arg: any) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => {
        cb(arg);
      });
    } else {
      throw new Error(`No event : ${event}`);
    }
  }
}

export default VegaWeb3;
