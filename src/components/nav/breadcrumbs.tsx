import "./breadcrumbs.scss";

import { useHistory } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

export const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const history = useHistory();
  return breadcrumbs.length > 1 ? (
    <div className="breadcrumbs">
      {breadcrumbs.map(({ breadcrumb, match }, index) => (
        <div key={`${index}-container`} data-testid="breadcrumb">
          <button
            className="button-link"
            key={`${index}-link`}
            onClick={() => history.push(match.url)}
          >
            {breadcrumb}
          </button>
          <span key={`${index}-spacer`} className="breadcrumbs__spacer">
            {index !== breadcrumbs.length - 1 && ">"}
          </span>
        </div>
      ))}
    </div>
  ) : null;
};
