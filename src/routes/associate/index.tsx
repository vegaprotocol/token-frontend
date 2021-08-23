import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";
import { useLocation } from "react-router-dom";

enum StakingMethod {
  Contract = "Contract",
  Wallet = "Wallet",
}

const Associate = ({ name }: RouteChildProps) => {
  const location = useLocation();
  const stakingMethod = React.useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("method") as StakingMethod | "";
  }, [location.search]);

  const [state, setState] = React.useState<StakingMethod | "">(stakingMethod);
  useDocumentTitle(name);
  const { t } = useTranslation();

  return (
    <DefaultTemplate title={t("pageTitleAssociate")}>
      <Web3Container>
        <p>
          To participate in Governance or to Nominate a node you’ll need to
          associate VEGA tokens with a Vega wallet/key. This Vega key can then
          be used to Propose, Vote and nominate nodes.
        </p>
        <h2>Where would you like to stake from?</h2>
        <RadioGroup
          inline={true}
          onChange={(e: FormEvent<HTMLInputElement>) => {
            // @ts-ignore
            setState(e.target.value);
          }}
          selectedValue={state}
        >
          <Radio label={"Vesting contract"} value={StakingMethod.Contract} />
          <Radio label={"Wallet"} value={StakingMethod.Wallet} />
        </RadioGroup>
      </Web3Container>
    </DefaultTemplate>
  );
};

export default Associate;
