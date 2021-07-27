import React from "react";
import "./App.scss";
import { Heading } from "./components/heading";
import { AppRouter } from "./routes";

function App() {
  const pubkey = "0x" + "0".repeat(40);

  return (
    <div className="app-wrapper">
      <Heading pubkey={pubkey} error={null} connected={true} loading={false} />
      <AppRouter />
    </div>
  );
}

export default App;
