import React from "react";
import { EtherscanLink } from "../../components/etherscan-link";
import { Heading } from "../../components/heading";
import { ADDRESSES } from "../../config";
import { useWeb3 } from "../../contexts/web3-context/web3-context";

const Contracts = () => {
  const { chainId } = useWeb3();

  return (
    <section>
      <Heading title={"Contracts"} />
      <hr />
      {Object.entries(ADDRESSES).map(([key, value]) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{key}:</div>
          <EtherscanLink address={value} chainId={chainId} />
        </div>
      ))}
    </section>
  );
};

export default Contracts;
