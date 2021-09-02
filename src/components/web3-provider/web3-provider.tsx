import React from "react";
// @ts-ignore
import detectEthereumProvider from "DETECT_PROVIDER_PATH/detect-provider";
import { SplashScreen } from "../splash-screen";
import { SplashLoader } from "../splash-loader";

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
