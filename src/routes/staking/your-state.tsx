import React from "react";
import { useTranslation } from "react-i18next";
import { Radio, RadioGroup } from "@blueprintjs/core";
import { FormEvent } from "react";

import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";

enum ManageStakeMethod {
  Add = "Add",
  Remove = "Remove",
}


export interface YourStakeProps {
  node: string;
}

export const YourStake = ({ node }: YourStakeProps) => {
    const [selectedManageStakeMethod, setSelectedManageStakeMethod] = React.useState<
      ManageStakeMethod
    >(ManageStakeMethod.Add);
  const { t } = useTranslation();

  // TODO get stake data based on the node
  const nodeData = {
    yourStakeThisEpoch: "1.00",
    yourStakeNextEpoch: "10.00",
  };

  return (
    <>
      <h2>{t("Your Stake")}</h2>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("Your Stake On Node (This Epoch)")}</th>
          <td>{nodeData.yourStakeThisEpoch}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("Your Stake On Node (Next Epoch)")}</th>
          <td>{nodeData.yourStakeNextEpoch}</td>
        </KeyValueTableRow>
      </KeyValueTable>

      <h2>{t("Manage your stake")}</h2>
      <RadioGroup
        inline={true}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          // @ts-ignore
          setSelectedManageStakeMethod(e.target.value);
        }}
        selectedValue={selectedManageStakeMethod}
      >
        <Radio
          data-testid="your-stake-radio-add"
          label={t("Add Stake")}
          value={ManageStakeMethod.Add}
        />
        <Radio
          data-testid="your-stake-radio-remove"
          label={t("Remove Stake")}
          value={ManageStakeMethod.Remove}
        />
      </RadioGroup>
    </>
  );
};
