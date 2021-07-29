import React from "react";

export interface AppState {
  address: string | null;
  connecting: boolean;
}

export type AppStateAction =
  | { type: "CONNECT" }
  | { type: "CONNECT_SUCCESS"; address: string }
  | { type: "CONNECT_FAIL"; error: Error };

type AppStateContextShape = [AppState, React.Dispatch<AppStateAction>];

export const AppStateContext = React.createContext<
  AppStateContextShape | undefined
>(undefined);

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
