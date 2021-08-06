import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { Heading } from "../heading";
import { Notice } from "../notice";
import { WrongChain } from "../wrong-chain";

export interface DefaultTemplateProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  const { appState } = useAppState();
  let splash = null;
  if (appState.chainId !== appState.appChainId) {
    splash = (
      <WrongChain
        currentChainId={appState.chainId!}
        desiredChainId={appState.appChainId}
      />
    );
  }
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{splash ? splash : children}</main>
      <footer>
        <Notice />
      </footer>
    </div>
  );
}
