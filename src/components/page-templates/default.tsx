import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Addresses } from "../../lib/web3-utils";
import { WrongChain } from "../wrong-chain";
import { Heading } from "../heading";
import { Loading } from "../loading";
import { Notice } from "../notice";

export interface DefaultTemplateProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
}

export function DefaultTemplate({ children, title }: DefaultTemplateProps) {
  const vesting = useVegaVesting();
  const { appState, appDispatch } = useAppState();
  const { vestingAddress } = Addresses[appState.appChainId];
  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: "SET_TRANCHES", tranches });
    };
    run();
  }, [appDispatch, vesting]);
  let content;
  if (appState.chainId && appState.chainId !== appState.appChainId) {
    content = (
      <WrongChain
        currentChainId={appState.chainId!}
        desiredChainId={appState.appChainId}
      />
    );
  } else if (!appState.tranches.length) {
    content = <Loading />;
  } else {
    content = children;
  }
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{content}</main>
      <footer>
        <Notice vestingAddress={vestingAddress} />
      </footer>
    </div>
  );
}
