import "./i18n";
import { ApolloProvider } from "@apollo/client";
import { AppRouter } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { client } from "./lib/apollo-client";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppStateProvider>
          <AppRouter />
        </AppStateProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
