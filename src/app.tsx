import "./i18n";
import "./app.scss";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SingletonHooksContainer } from "react-singleton-hook";

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
import { Web3Provider } from "./contexts/web3-context/web3-provider";
import { AppRouter } from "./routes";

function App() {
  const sideBar = React.useMemo(() => [<EthWallet />, <VegaWallet />], []);
  return (
    <GraphQlProvider>
      <Router>
        <Web3Provider>
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
                  <SingletonHooksContainer />
                  <VegaWalletModal />
                </BalanceManager>
              </AppLoader>
            </AppStateProvider>
          </ContractsProvider>
        </Web3Provider>
      </Router>
    </GraphQlProvider>
  );
}

export default App;
