import "./i18n";
import "./app.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { GraphQlProvider } from "./components/graphql-provider/__mocks__/graphql-provider";
import { AppLoader } from "./app-loader";
import { Web3Provider } from "./contexts/web3-context/web3-provider";
import { ContractsProvider } from "./contexts/contracts/contracts-provider";
import { TemplateSidebar } from "./components/page-templates/template-sidebar";
import { EthWallet } from "./components/eth-wallet";
import { VegaWallet } from "./components/vega-wallet";
import { BalanceManager } from "./components/balance-manager";
import { Flags } from "./config";
import React from "react";

function App() {
  const sideBar = React.useMemo(
    () =>
      [<EthWallet />, Flags.STAKING_DISABLED ? null : <VegaWallet />].filter(
        Boolean
      ),
    []
  );
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
                    <footer>
                      Version: {process.env.COMMIT_REF || "development"}
                    </footer>
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
