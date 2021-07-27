import React from "react";
import "./App.scss";
import { Heading } from "./components/heading";
import { AppRouter } from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import { Notice } from "./components/notice";
import VegaWeb3, { EthereumChainIds } from "./lib/vega-web3";

const vestingAddress = "0x23d1bFE8fA50a167816fBD79D7932577c06011f4";
// const vegaTokenAddress = "0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e";

function App() {
  const pubkey = "0x" + "0".repeat(40);
  const run = React.useCallback(async () => {
    const vega = new VegaWeb3(EthereumChainIds.Mainnet);
    const res = await vega.getAllTranches();
    console.log(res);
  }, []);
  React.useEffect(() => {
    run();
  }, [run]);
  return (
    <div className="app-wrapper">
      <Router>
        <Heading
          pubkey={pubkey}
          error={null}
          connected={true}
          loading={false}
          connect={() => console.log("connect")}
          balance={"123"}
        />
        <AppRouter />
      </Router>
      <Notice vestingAddress={vestingAddress} />
    </div>
  );
}

export default App;
