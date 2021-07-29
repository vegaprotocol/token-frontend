import type { Tranche } from "../vega-web3-types";
import { EthereumChainId } from "../vega-web3-utils";
import { generateTranches } from "./generate-tranche";
import { PromiEvent } from "web3-core";

class VegaWeb3 {
  private chainId: EthereumChainId;

  constructor(chainId: EthereumChainId) {
    this.chainId = chainId;
  }

  async getAllTranches(): Promise<Tranche[]> {
    return Promise.resolve(generateTranches(10));
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

class MockPromiEvent {
  events: { [event: string]: Array<Function> } = {};

  on(event: string, callback: Function) {
    console.log(event);
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
