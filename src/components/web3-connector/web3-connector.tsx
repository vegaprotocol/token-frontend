import { useEagerConnect, useInactiveListener } from "../../hooks/use-web3";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export function Web3Connector({ children }: any) {
  const tried = useEagerConnect();
  useInactiveListener();

  if (!tried) {
    return (
      <SplashScreen>
        <SplashLoader></SplashLoader>
      </SplashScreen>
    );
  }

  return children;
}
