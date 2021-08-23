import "./associate.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { DefaultTemplate } from "../../components/page-templates/default";
import { Web3Container } from "../../components/web3-container";
import { RouteChildProps } from "..";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { ContractAssociate } from "./contract-associate";

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

  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);
  useDocumentTitle(name);
  const { t } = useTranslation();
  return (
    <DefaultTemplate title={t("pageTitleAssociate")}>
      <Web3Container>
        <p data-testid="associate-information">
          {t(
            "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
          )}
        </p>
        <h2 data-testid="associate-subheader">
          {t("Where would you like to stake from?")}
        </h2>
        <RadioGroup
          data-testid="associate-radio"
          inline={true}
          onChange={(e: FormEvent<HTMLInputElement>) => {
            // @ts-ignore
            setSelectedStakingMethod(e.target.value);
          }}
          selectedValue={selectedStakingMethod}
        >
          <Radio
            data-testid="associate-radio-contract"
            label={t("Vesting contract")}
            value={StakingMethod.Contract}
          />
          <Radio
            data-testid="associate-radio-wallet"
            label={t("Wallet")}
            value={StakingMethod.Wallet}
          />
        </RadioGroup>
        {selectedStakingMethod &&
          (selectedStakingMethod === StakingMethod.Contract ? (
            <ContractAssociate />
          ) : null)}
      </Web3Container>
    </DefaultTemplate>
  );
};

export default Associate;
