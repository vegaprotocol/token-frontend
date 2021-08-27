import "./i18n";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { Nav } from "./components/nav";
import { Notice } from "./components/notice";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { EthWalletModal } from "./components/eth-wallet/eth-wallet-modal";
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppStateProvider>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              minHeight: "100%",
            }}
          >
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
    </ApolloProvider>
  );
}

export default App;
