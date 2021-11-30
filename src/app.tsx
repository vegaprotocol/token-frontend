import "./i18n";
import "./app.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";
import { AppLoader } from "./app-loader";
import { Web3Provider } from "./contexts/web3-context/web3-provider";
import { ContractsProvider } from "./contexts/contracts/contracts-provider";
import { TemplateSidebar } from "./components/page-templates/template-sidebar";
import { EthWallet } from "./components/eth-wallet";
import { VegaWallet } from "./components/vega-wallet";
import { BalanceManager } from "./components/balance-manager";
import React from "react";
import { AppFooter } from "./components/app-footer";

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
