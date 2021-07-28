import React from "react";
import "./app.scss";
import { Heading } from "./components/heading";
import { AppRouter } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { Notice } from "./components/notice";

const vestingAddress = "0x23d1bFE8fA50a167816fBD79D7932577c06011f4";
// const vegaTokenAddress = "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e";

function App() {
  const pubkey = "0x" + "0".repeat(40); 

  return (
    <Router>
      <div className="app-wrapper">
        <Heading
          pubkey={pubkey}
          error={null}
          connected={true}
          loading={false}
          connect={() => console.log("connect")}
          balance={"123"}
        />
        <main>
          <AppRouter />
        </main>
        <footer>
          <Notice vestingAddress={vestingAddress} />
        </footer>
      </div>
    </Router>
  );
}

export default App;
