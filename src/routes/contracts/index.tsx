import React from "react";
import { EtherscanLink } from "../../components/etherscan-link";
import { Heading } from "../../components/heading";
import { ADDRESSES } from "../../config";

const Contracts = () => {
  return (
    <section>
      <Heading title={"Contracts"} />
      <hr />
      {Object.entries(ADDRESSES).map(([key, value]) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{key}:</div>
          <EtherscanLink address={value} text={value} />
        </div>
      ))}
    </section>
  );
};

export default Contracts;
