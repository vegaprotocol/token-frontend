import { useTranslation } from "react-i18next";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";

export interface YourStakeProps {
  node: string;
}

export const YourStake = ({ node }: YourStakeProps) => {
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
    </>
  );
};
