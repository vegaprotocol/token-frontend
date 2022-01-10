import { useAppState } from "../../contexts/app-state/app-state-context";
import { Error } from "../icons";
import "./app-banner.scss";

export const AppBanner = () => {
  const {
    appState: { bannerMessage },
  } = useAppState();

  if (!bannerMessage) return null;

  return (
    <div className="app-banner" role="alert">
      <p>
        <span className="app-banner__icon">
          <Error />
        </span>
        {bannerMessage}
      </p>
    </div>
  );
};
