import { useAppState } from "../../contexts/app-state/app-state-context";

interface VegaWalletContainerProps {
  children: React.ReactNode;
}

export const VegaWalletContainer = ({ children }: VegaWalletContainerProps) => {
  const { appState } = useAppState();
  return children;
};
