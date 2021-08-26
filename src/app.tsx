import "./i18n";
import { ApolloProvider } from "@apollo/client";
import { AppRouter } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AppStateProvider } from "./contexts/app-state/app-state-provider";
import { client } from "./lib/apollo-client";
import { Nav } from "./components/nav";
import { Notice } from "./components/notice";

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppStateProvider>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              minHeight: "100%",
            }}
          >
            <Nav />
            <AppRouter />
            <footer>
              <Notice />
            </footer>
          </div>
        </AppStateProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
