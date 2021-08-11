import React from "react";

import "./i18n";
import "./app.scss";
import { AppRouter } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";

function App() {
  return (
    <Router>
      <AppStateProvider>
        <AppRouter />
      </AppStateProvider>
    </Router>
  );
}

export default App;
