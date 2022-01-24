import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ethers } from "ethers";

const getAccount = (number = 0) => `m/44'/60'/0'/0/${number}`;

// Address of the above key
export class CustomizedBridge extends Eip1193Bridge {
  chainId = 3;

  async sendAsync(...args) {
    console.debug("sendAsync called", ...args);
    return this.send(...args);
  }
  async send(...args) {
    console.debug("send called", ...args);
    const isCallbackForm =
      typeof args[0] === "object" && typeof args[1] === "function";
    let callback;
    let method;
    let params;
    if (isCallbackForm) {
      callback = args[1];
      method = args[0].method;
      params = args[0].params;
    } else {
      method = args[0];
      params = args[1];
    }
    try {
      // Mock out request accounts and chainId
      if (method === "eth_requestAccounts" || method === "eth_accounts") {
        const address = this.signer ? [await this.signer.getAddress()] : [];
        if (isCallbackForm) {
          callback({ result: address });
        } else {
          return Promise.resolve(address);
        }
      }
      if (method === "eth_chainId") {
        if (isCallbackForm) {
          callback(null, { result: "0x3" });
        } else {
          return Promise.resolve("0x3");
        }
      }
      // Hacky, https://github.com/ethers-io/ethers.js/issues/1683#issuecomment-1016227588

      // If from is present on eth_call it errors, removing it makes the library set
      // from as the connected wallet which works fine
      if (params && params.length && params[0].from && method === "eth_call")
        delete params[0].from;
      let result;
      // For sending a transaction if we call send it will error
      // as it wants gasLimit in sendTransaction but hexlify sets the property gas
      // to gasLimit which makes sensd transaction error.
      // This has taken the code from the super method for sendTransaction and altered
      // it slightly to make it work with the gas limit issues.
      if (
        params &&
        params.length &&
        params[0].from &&
        method === "eth_sendTransaction"
      ) {
        // Hexlify will not take gas, must be gasLimit, set this property to be gasLimit
        params[0].gasLimit = params[0].gas;
        delete params[0].gas;
        // If from is present on eth_sendTransaction it errors, removing it makes the library set
        // from as the connected wallet which works fine
        delete params[0].from;
        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          params[0]
        );
        // Hexlify sets the gasLimit property to be gas again and send transaction requires gasLimit
        req.gasLimit = req.gas;
        delete req.gas;
        // Send the transaction
        const tx = await this.signer.sendTransaction(req);
        result = tx.hash;
      } else {
        // All other transactions the base class works for
        result = await super.send(method, params);
      }
      console.debug("result received", method, params, result);
      if (isCallbackForm) {
        callback(null, { result });
      } else {
        return result;
      }
    } catch (error) {
      console.log(error);
      if (isCallbackForm) {
        callback(error, null);
      } else {
        throw error;
      }
    }
  }
}

const INFURA_ID = Cypress.env("INFURA_ID");
const INTEGRATION_TEST_MNEMONIC = Cypress.env("INTEGRATION_TEST_MNEMONIC");

const getProvider = () =>
  new JsonRpcProvider(`https://ropsten.infura.io/v3/${INFURA_ID}`, 3);

export const signerlessBridge = () => {
  const provider = getProvider();
  return new CustomizedBridge(null, provider);
};

export const createBridge = (accountNumber) => {
  const provider = getProvider();
  const privateKey = Wallet.fromMnemonic(
    INTEGRATION_TEST_MNEMONIC,
    getAccount(accountNumber)
  ).privateKey;

  const signer = new Wallet(privateKey, provider);
  return new CustomizedBridge(signer, provider);
};
