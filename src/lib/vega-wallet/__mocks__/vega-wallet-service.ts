import { VegaKey } from "../../../contexts/app-state/app-state-context";
import {IVegaWalletService} from "../vega-wallet-service";
import {GenericErrorResponse} from "../vega-wallet-types";

export const Errors = {
  NO_TOKEN: "No Token"
}

export const MINIMUM_WALLET_VERSION = '0.0.0';

export function hasErrorProperty(obj: unknown): obj is GenericErrorResponse {
  return false
}

export class VegaWalletService implements IVegaWalletService {
    url: string;
    token: string;
    statusPoll: any;

    constructor() {
      this.url = "https://localhost"
      this.token = ""
    }
    getToken(params: { wallet: string; passphrase: string; }): Promise<[string | undefined, string | undefined]> {
        return Promise.resolve([this.token, this.token])
    }
    revokeToken(): Promise<[string | undefined, boolean]> {
      return Promise.resolve([undefined, true])
    }
    getKeys(): Promise<[string | undefined, VegaKey[] | undefined]> {
      const key: VegaKey = {
        algo: "ed25519", meta: [], pub: "0680ffba6c2e0239ebaa2b941ee79675dd1f447ddcae37720f8f377101f46527", tainted: false

      }
      return Promise.resolve([undefined, [key]])
    }
    isSupportedVersion(){
      return true
    }
    getVersion() {
      return [undefined, "0.10.0"]
    }

}

export const vegaWalletService = new VegaWalletService()
