import React from "react";
import "./App.scss";
import { Heading } from "./components/heading";
import { AppRouter } from "./routes";
import { BrowserRouter as Router, useRouteMatch } from "react-router-dom";

function App() {
  const pubkey = "0x" + "0".repeat(40);
  return (
    <div className="app-wrapper">
      <Router>
        <Heading
          pubkey={pubkey}
          error={null}
          connected={true}
          loading={false}
          connect={() => console.log("connect")}
        />
        <AppRouter />
      </Router>
    </div>
  );
}

export default App;
