import React from "react";
import { AppState, AppStateContext, AppStateAction } from "./app-state-context";

interface AppStateProviderProps {
  children: React.ReactNode;
}

const initialAppState: AppState = {
  address: null,
  connecting: false,
};

function appStateReducer(state: AppState, action: AppStateAction) {
  switch (action.type) {
    case "CONNECT":
      return {
        ...state,
        connecting: true,
      };
    case "CONNECT_SUCCESS":
      return {
        ...state,
        address: action.address,
        connecting: false,
      };
    case "CONNECT_FAIL":
      return {
        ...state,
        address: null,
        connecting: false,
      };
    default:
      return state;
  }
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = React.useReducer(appStateReducer, initialAppState);

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {children}
    </AppStateContext.Provider>
  );
}
