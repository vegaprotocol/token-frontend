import Web3 from "web3";
import vestingAbi from "./vesting_abi.json";
import type { Contract, EventData } from "web3-eth-contract";
import _ from "lodash";
import { EthereumChainId, EthereumChainIds } from "./vega-web3-utils";
import type { Tranche } from "./vega-web3-types";



export interface ContractAddress {
  vestingAddress: string;
  vegaTokenAddress: string;
}

export const Addresses = {
  [EthereumChainIds.Mainnet]: {
    vestingAddress: "0x23d1bFE8fA50a167816fBD79D7932577c06011f4",
    vegaTokenAddress: "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e",
  },
};

class VegaWeb3 {
  private chainId: EthereumChainId;
  private vestingInstance: Contract;
  public web3: Web3;
  public currentAccount: string | null = null;
  private eventListeners = [];
  private provider: any;

  constructor(chainId: EthereumChainId) {
    this.chainId = chainId;
    const contractsAddresses = Addresses[chainId];
    if (!contractsAddresses) {
      throw new Error(" Could not find contract addresses for network");
    }
    const provider = new Web3.providers.HttpProvider(
      "https://mainnet.infura.io/v3/5aff9e61ad844bcf982d0d0c3f1d29f1"
    );
    this.provider = provider;
    let web3 = new Web3(provider);
    this.web3 = web3;
    let vestingInstance = new web3.eth.Contract(
      // @ts-ignore
      vestingAbi,
      contractsAddresses.vestingAddress
    );
    this.vestingInstance = vestingInstance;
  }

  async getBalanceAllTranches(account: string): Promise<any> {
    return this.vestingInstance.methods.user_total_all_tranches(account).call();
  }

  async getTotalTokens() {}

  private getUsersInTranche(
    balance_added_events: EventData[],
    balance_removed_events: EventData[],
    unique_addresses: string[]
  ) {
    const updated_users: any[] = [];
    unique_addresses.forEach((address) => {
      const user_deposit_events = balance_added_events.filter(
        (event) => event.returnValues.user === address
      );
      const user_withdraw_events = balance_removed_events.filter(
        (event) => event.returnValues.user === address
      );
      const deposits = user_deposit_events.map((event) => {
        return {
          amount: parseFloat(
            this.web3.utils.fromWei(event.returnValues.amount)
          ),
          user: event.returnValues.user,
          tranche_id: event.returnValues.tranche_id,
          tx: event.transactionHash,
        };
      });
      const withdrawals = user_withdraw_events.map((event) => {
        return {
          amount: parseFloat(
            this.web3.utils.fromWei(event.returnValues.amount)
          ),
          user: event.returnValues.user,
          tranche_id: event.returnValues.tranche_id,
          tx: event.transactionHash,
        };
      });
      const total_tokens = _.sumBy(deposits, "amount");
      const withdrawn_tokens = _.sumBy(withdrawals, "amount");
      const remaining_tokens = total_tokens - withdrawn_tokens;
      updated_users.push({
        address,
        deposits,
        withdrawals,
        total_tokens,
        withdrawn_tokens,
        remaining_tokens,
      });
    });
    return updated_users;
  }

  private getTranchesFromHistory(events: EventData[]) {
    const tranche_created_events = events.filter(
      (event) => event.event === "Tranche_Created"
    );
    const updated_tranches: any[] = [];
    tranche_created_events.forEach((event) => {
      const tranche_id = event.returnValues.tranche_id;
      const balance_added_events = events.filter(
        (event) =>
          event.event === "Tranche_Balance_Added" &&
          event.returnValues.tranche_id === tranche_id
      );
      const balance_removed_events = events.filter(
        (event) =>
          event.event === "Tranche_Balance_Removed" &&
          event.returnValues.tranche_id === tranche_id
      );
      const balance_added_amounts = balance_added_events.map((event) =>
        parseFloat(this.web3.utils.fromWei(event.returnValues.amount))
      );
      const balance_removed_amounts = balance_removed_events.map((event) =>
        parseFloat(this.web3.utils.fromWei(event.returnValues.amount))
      );
      const cliff_start = parseInt(event.returnValues.cliff_start);
      const tranche_duration = parseInt(event.returnValues.duration);
      const total_added = _.sum(balance_added_amounts);
      const total_removed = _.sum(balance_removed_amounts);
      let locked_amount = 0;
      const ts = Math.round(new Date().getTime() / 1000);
      const tranche_progress = (ts - cliff_start) / tranche_duration;
      if (tranche_progress < 0) {
        locked_amount = total_added;
      } else if (tranche_progress < 1) {
        locked_amount = total_added * (1 - tranche_progress);
      }
      const deposits = balance_added_events.map((event) => {
        return {
          amount: parseFloat(
            this.web3.utils.fromWei(event.returnValues.amount)
          ),
          user: event.returnValues.user,
          tx: event.transactionHash,
        };
      });
      const withdrawals = balance_removed_events.map((event) => {
        return {
          amount: parseFloat(
            this.web3.utils.fromWei(event.returnValues.amount)
          ),
          user: event.returnValues.user,
          tx: event.transactionHash,
        };
      });
      const tranche_start = new Date(cliff_start * 1000);
      const tranche_end = new Date((cliff_start + tranche_duration) * 1000);
      const unique_addresses = _.uniq(
        balance_added_events.map((event) => event.returnValues.user)
      );
      const users = this.getUsersInTranche(
        balance_added_events,
        balance_removed_events,
        unique_addresses
      );
      updated_tranches.push({
        tranche_id,
        tranche_start,
        tranche_end,
        total_added,
        total_removed,
        locked_amount,
        deposits,
        withdrawals,
        users,
      });
    });
    return updated_tranches;
  }

  async getAllTranches(): Promise<Tranche[]> {
    const events = await this.vestingInstance.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return this.getTranchesFromHistory(events);
  }

  async getUserBalancesPerTranche() {}

  async redeem() {}

  async commitCode() {}

  async revealCode() {}

  // async connectToEthWallet(): Promise<string> {
  //   // @ts-ignore
  //   if (!window.ethereum) {
  //     throw new Error("Could not find Ethereum provider");
  //   }
  //   const accounts = await this.web3.eth.requestAccounts();
  //   if (!accounts.length) {
  //     throw new Error("Could not find account");
  //   }
  //   this.currentAccount = accounts[0];
  //   this.provider.on(
  //     "connected",
  //     (connectInfo: { chainId: EthereumChainId }) => {
  //       this.connected = true;
  //       this.chainId = connectInfo?.chainId;
  //     }
  //   );
  //   this.provider.on("disconnect", () => {
  //     this.connected = false;
  //   });

  //   this.provider.on("accountsChanged", (accounts: string[]) => {
  //     if (accounts.length) {
  //       this.currentAccount = accounts[0];
  //     } else {
  //       this.currentAccount = null;
  //     }
  //   });

  //   this.provider.on("chainChanged", (chainId: EthereumChainId) => {});
  //   return accounts[0];
  // }

  // off() {
  //   // TODO
  // }
}

export default VegaWeb3;
