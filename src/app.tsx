import "./i18n";
import "./app.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { Nav } from "./components/nav";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { EthWalletModal } from "./components/eth-wallet/eth-wallet-modal";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";
import { AppLoader } from "./app-loader";
import { Web3Provider } from "./contexts/web3-context/web3-provider";
import { ContractsProvider } from "./contexts/contracts/contracts-provider";
import { useWeb3 } from "./contexts/web3-context/web3-context";

function App() {
  return (
    <GraphQlProvider>
      <Router>
        <Web3Provider>
          {/* <AppStateProvider>
            <ContractsProvider>
              <AppLoader>
                <>
                  <div className="app">
                    <Nav />
                    <AppRouter />
                  </div>
                  <VegaWalletModal />
                  <EthWalletModal />
                </>
              </AppLoader>
            </ContractsProvider>
          </AppStateProvider> */}
          <Child />
        </Web3Provider>
      </Router>
    </GraphQlProvider>
  );
}

function Child() {
  const { chainId } = useWeb3();
  return <div>Chain: {chainId}</div>;
}

export default App;
