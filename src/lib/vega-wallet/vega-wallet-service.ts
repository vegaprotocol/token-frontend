import { VegaKey } from "../../contexts/app-state/app-state-context";

const DEFAULT_WALLET_URL = "http://localhost:1789/api/v1";

const Endpoints = {
  STATUS: "status",
  TOKEN: "auth/token",
  KEYS: "keys",
};

const Errors = {
  NO_TOKEN: "No token",
  SERVICE_UNAVAILABLE: "Service unavailable",
  SESSION_EXPIRED: "Session expired",
  INVALID_CREDENTIALS: "Invalid credentials",
};

export class VegaWalletService {
  url: string;
  token: string;
  statusPoll: any;

  constructor() {
    this.url = localStorage.getItem("vega_wallet_url") || DEFAULT_WALLET_URL;
    this.token = localStorage.getItem("vega_wallet_token") || "";
  }

  async getStatus() {
    try {
      const res = await fetch(`${this.url}/${Endpoints.STATUS}`);
      const json = await res.json();
      if (json.hasOwnProperty("success") && json.success) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  async getToken(params: {
    wallet: string;
    passphrase: string;
  }): Promise<[string | undefined, string | undefined]> {
    try {
      const res = await fetch(`${this.url}/${Endpoints.TOKEN}`, {
        method: "post",
        body: JSON.stringify(params),
      });
      const json = await res.json();

      if (json.hasOwnProperty("token")) {
        this.setToken(json.token);
        return [undefined, json.token];
      } else {
        return [Errors.INVALID_CREDENTIALS, undefined];
      }
    } catch (err) {
      return [Errors.SERVICE_UNAVAILABLE, undefined];
    }
  }

  async revokeToken(): Promise<[string | undefined, boolean]> {
    if (!this.token) {
      return [Errors.NO_TOKEN, false];
    }

    try {
      const res = await fetch(`${this.url}/${Endpoints.TOKEN}`, {
        method: "delete",
        headers: { authorization: `Bearer ${this.token}` },
      });
      const json = await res.json();

      if (json.success) {
        this.clearToken();
        return [undefined, true];
      } else {
        return [undefined, false];
      }
    } catch (err) {
      return [Errors.SERVICE_UNAVAILABLE, false];
    }
  }

  async getKeys(): Promise<[string | undefined, VegaKey[] | undefined]> {
    if (!this.token) {
      return [Errors.NO_TOKEN, undefined];
    }

    try {
      const res = await fetch(`${this.url}/${Endpoints.KEYS}`, {
        headers: { authorization: `Bearer ${this.token}` },
      });

      // forbidden, clear token
      if (res.status === 403) {
        this.clearToken();
        return [Errors.SESSION_EXPIRED, undefined];
      }

      const json = await res.json();

      return [undefined, json.keys];
    } catch (err) {
      return [Errors.SERVICE_UNAVAILABLE, undefined];
    }
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem("vega_wallet_token", token);
  }

  private clearToken() {
    this.token = "";
    localStorage.removeItem("vega_wallet_token");
  }
}

export const vegaWalletService = new VegaWalletService();
