import "./i18n";
import "./app.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { Nav } from "./components/nav";
import { Notice } from "./components/notice";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { EthWalletModal } from "./components/eth-wallet/eth-wallet-modal";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";

function App() {
  return (
    <GraphQlProvider>
      <Router>
        <AppStateProvider>
          <div className="app">
            <Nav />
            <AppRouter />
            <footer>
              <Notice />
            </footer>
          </div>
          <VegaWalletModal />
          <EthWalletModal />
        </AppStateProvider>
      </Router>
    </GraphQlProvider>
  );
}

export default App;
