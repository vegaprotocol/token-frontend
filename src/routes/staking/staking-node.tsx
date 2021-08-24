import "./staking-node.scss";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";

interface StakingNodeProps {
  vegaKey: VegaKeyExtended;
}

export const StakingNode = ({ vegaKey }: StakingNodeProps) => {
  const { t } = useTranslation();
  const { node } = useParams<{ node: string }>();
  const validator = {
    address: "aecfd920cbadbe1c5040a989fabb765bbc6685f4825de8b6a9cff98919dc3a89",
    about: "VEGANODZ.COM",
    ip: "192.168.1.1",
    totalStake: "3000.00",
    stakeShare: "23.02%",
    ownStake: "3000.00",
    nominated: "0.00",
  };

  return (
    <>
      <h1>{t("VALIDATOR {{node}}", { node })}</h1>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>{t("VEGA ADDRESS / PUBLIC KEY")}</th>
          <td className="staking-node__cell">{validator.address}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("ABOUT THIS VALIDATOR")}</th>
          <td>{validator.about}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("IP ADDRESS")}</th>
          <td>{validator.ip}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("TOTAL STAKE")}</th>
          <td>{validator.totalStake}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("STAKE SHARE")}</th>
          <td>{validator.stakeShare}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("OWN STAKE (THIS EPOCH)")}</th>
          <td>{validator.ownStake}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>{t("NOMINATED (THIS EPOCH)")}</th>
          <td>{validator.nominated}</td>
        </KeyValueTableRow>
      </KeyValueTable>
    </>
  );
};
