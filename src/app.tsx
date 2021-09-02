import "./i18n";
import "./app.scss";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "./routes";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { Nav } from "./components/nav";
import { Notice } from "./components/notice";
import { VegaWalletModal } from "./components/vega-wallet/vega-wallet-modal";
import { EthWalletModal } from "./components/eth-wallet/eth-wallet-modal";
// @ts-ignore
import { GraphQlProvider } from "./components/GRAPHQL_PROVIDER/graphql-provider";
// @ts-ignore
import detectEthereumProvider from "DETECT_PROVIDER_PATH/detect-provider";
import { SplashScreen } from "./components/splash-screen";
import { SplashLoader } from "./components/splash-loader";
import { AppLoader } from "./app-loader";

function App() {
  return (
    <GraphQlProvider>
      <Router>
        <Web3Provider>
          {(provider) => (
            <AppStateProvider provider={provider}>
              <AppLoader>
                <>
                  <div className="app">
                    <Nav />
                    <AppRouter />
                    <footer>
                      <Notice />
                    </footer>
                  </div>
                  <VegaWalletModal />
                  <EthWalletModal />
                </>
              </AppLoader>
            </AppStateProvider>
          )}
        </Web3Provider>
      </Router>
    </GraphQlProvider>
  );
}

export default App;

enum ProviderStatus {
  Pending,
  Ready,
  None,
}

export const Web3Provider = ({
  children,
}: {
  children: (provider: object) => JSX.Element;
}) => {
  const provider = React.useRef<any>();
  const [status, setStatus] = React.useState(ProviderStatus.Pending);

  // Detect provider
  React.useEffect(() => {
    detectEthereumProvider()
      .then((res: any) => {
        // Extra check helps with Opera's legacy web3 - it properly falls through to NOT_DETECTED
        if (res && res.request) {
          provider.current = res;
          setStatus(ProviderStatus.Ready);
        } else {
          setStatus(ProviderStatus.None);
        }
      })
      .catch(() => {
        setStatus(ProviderStatus.None);
      });
  }, []);

  if (status === ProviderStatus.Pending) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (status === ProviderStatus.None) {
    return (
      <SplashScreen>
        <div>
          No provider detected. Please install Metamask, or use a Web3 capable
          browser
        </div>
      </SplashScreen>
    );
  }

  return children(provider.current);
};
