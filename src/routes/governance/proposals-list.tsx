import "./proposals-list.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const ProposalsList = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="proposals-list__row">
        <Link className="proposals-list__first-item" to={"/test"}>
          {"Liquidity"}
        </Link>
        <p className="proposals-list__item-right">Proposed enactment</p>
      </div>
      <div className="proposals-list__row">
        <p className="proposals-list__item-left-low-key">Vote status</p>
        <span className="proposals-list__item-right">500</span>
      </div>

      <div className="proposals-list__row">
        <p className="proposals-list__item-left-low-key">12/12/2022</p>
        <p className="proposals-list__item-pass">Should pass</p>
      </div>
    </div>
  );
};
