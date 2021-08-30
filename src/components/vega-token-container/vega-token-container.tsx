import { useAppState } from "../../contexts/app-state/app-state-context";
import { SplashLoader } from "../splash-loader";
import { SplashScreen } from "../splash-screen";

export const VegaTokenContainer = ({
  children,
}: {
  children: (data: { decimals: number; totalSupply: string }) => JSX.Element;
}) => {
  const { appState } = useAppState();

  if (!appState.totalSupply || !appState.tokenDataLoaded) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  return children({
    decimals: appState.decimals,
    totalSupply: appState.totalSupply,
  });
};
