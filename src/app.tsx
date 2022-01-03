import "./i18n";
import "./app.scss";

import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppLoader } from "./app-loader";
import { AppFooter } from "./components/app-footer";
import { BalanceManager } from "./components/balance-manager";
import { EthWallet } from "./components/eth-wallet";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";
import { TemplateSidebar } from "./components/page-templates/template-sidebar";
import { VegaWallet } from "./components/vega-wallet";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { ContractsProvider } from "./contexts/contracts/contracts-provider";
import { AppRouter } from "./routes";

function App() {
  const sideBar = React.useMemo(() => [<EthWallet />, <VegaWallet />], []);
  return (
    <GraphQlProvider>
      <Router>
        <Web3ReactProvider
          getLibrary={(provider) => {
            const library = new ethers.providers.Web3Provider(provider);
            library.pollingInterval = 12000;
            return library;
          }}
        >
          <ContractsProvider>
            <AppStateProvider>
              <AppLoader>
                <BalanceManager>
                  <div className="app">
                    <TemplateSidebar sidebar={sideBar}>
                      <AppRouter />
                    </TemplateSidebar>
                    <AppFooter />
                  </div>
                  <VegaWalletModal />
                </BalanceManager>
              </AppLoader>
            </AppStateProvider>
          </ContractsProvider>
        </Web3ReactProvider>
      </Router>
    </GraphQlProvider>
  );
}

export default App;
