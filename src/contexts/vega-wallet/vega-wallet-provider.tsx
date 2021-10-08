import React from "react";
import {
  VegaWalletContext,
  VegaWalletState,
  VegaWalletStatus,
} from "./vega-wallet-context";
import { vegaWalletReducer } from "./vega-wallet-reducer";

const initialState: VegaWalletState = {
  status: VegaWalletStatus.Pending,
  keys: null,
  currKey: null,
};

export const VegaWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(vegaWalletReducer, initialState);
  return (
    <VegaWalletContext.Provider
      value={{ vegaWalletState: state, vegaWalletDispatch: dispatch }}
    >
      {children}
    </VegaWalletContext.Provider>
  );
};
