import "./proposal-change-text.scss";

import { Trans } from "react-i18next";

interface ProposalChangeTextProps {
  networkParam: {
    key: string;
    value: string;
  };
}

export const ProposalChangeText = ({
  networkParam,
}: ProposalChangeTextProps) => {
  return (
    <span className="proposal-change-text">
      <Trans
        i18nKey="proposalChange"
        values={{
          key: networkParam.key,
          value: networkParam.value,
        }}
        components={{
          code: <code />,
        }}
      />
    </span>
  );
};
