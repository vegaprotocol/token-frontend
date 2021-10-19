import "./i18n";
import "./app.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { Nav } from "./components/nav";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";
import { AppLoader } from "./app-loader";
import { Web3Provider } from "./contexts/web3-context/web3-provider";
import { ContractsProvider } from "./contexts/contracts/contracts-provider";

function App() {
  return (
    <GraphQlProvider>
      <Router>
        <Web3Provider>
          <AppStateProvider>
            <ContractsProvider>
              <AppLoader>
                <>
                  <div className="app">
                    <Nav />
                    <AppRouter />
                    <footer>
                      Version: {process.env.COMMIT_REF || "development"}
                    </footer>
                  </div>
                  <VegaWalletModal />
                </>
              </AppLoader>
            </ContractsProvider>
          </AppStateProvider>
        </Web3Provider>
      </Router>
    </GraphQlProvider>
  );
}

export default App;
