import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useVegaVesting } from "../../hooks/use-vega-vesting";
import { Addresses, EthereumChainId } from "../../lib/web3-utils";
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
  const chainId = process.env.REACT_APP_CHAIN as EthereumChainId;
  const { vestingAddress } = Addresses[chainId];
  React.useEffect(() => {
    const run = async () => {
      const tranches = await vesting.getAllTranches();
      appDispatch({ type: "SET_TRANCHES", tranches });
    };
    run();
  }, [appDispatch, vesting]);
  return (
    <div className="app-wrapper">
      <Heading title={title} />
      <main>{appState.tranches.length ? children : <Loading />}</main>
      <footer>
        <Notice vestingAddress={vestingAddress} />
      </footer>
    </div>
  );
}
