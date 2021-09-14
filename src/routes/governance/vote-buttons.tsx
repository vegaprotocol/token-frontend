import "./vote-buttons.scss";

import * as React from "react";
import { VoteState } from "./use-user-vote";
import { VoteValue } from "../../__generated__/globalTypes";
import { Colors } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useTranslation } from "react-i18next";
import { Parties_parties } from "./__generated__/Parties";

interface VoteButtonsProps {
  voteState: VoteState;
  castVote: (vote: VoteValue) => void;
  voteDatetime: string | null;
  votePending: boolean;
  party: Parties_parties | undefined | null;
}

export const VoteButtons = ({
  voteState,
  castVote,
  voteDatetime,
  votePending,
  party,
}: VoteButtonsProps) => {
  const { t } = useTranslation();
  const [changeVote, setChangeVote] = React.useState(false);
  const lacksGovernanceToken = party
    ? +party.stake.currentStakeAvailable === 0 ||
      party.stake.currentStakeAvailable === undefined
    : true;

  const {
    appState: { currVegaKey },
    appDispatch,
  } = useAppState();
  const isAuth = !!currVegaKey;

  if (!isAuth) {
    return (
      <button
        onClick={() =>
          appDispatch({
            type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
            isOpen: true,
          })
        }
        className="vote-buttons__logged-out-button fill"
        type="button"
      >
        {t("connectToVote")}
      </button>
    );
  }

  if (lacksGovernanceToken) {
    return (
      <h3 className="vote-buttons__container">{t("noGovernanceTokens")}</h3>
    );
  }

  let voteColor = Colors.WHITE;

  if (voteState === VoteState.No) {
    voteColor = Colors.VEGA_RED;
  } else if (voteState === VoteState.Yes) {
    voteColor = Colors.VEGA_GREEN;
  }

  function submitVote(vote: VoteValue) {
    setChangeVote(false);
    castVote(vote);
  }

  if (
    (voteState === VoteState.No || voteState === VoteState.Yes) &&
    !votePending &&
    !changeVote
  ) {
    return (
      <div>
        <span>{t("youVoted")}</span>{" "}
        <span style={{ color: voteColor }}>{t(`voteState_${voteState}`)}</span>
        {". "}
        {voteDatetime ? <span>{voteDatetime}. </span> : null}
        <a
          onClick={() => {
            setChangeVote(true);
          }}
        >
          {t("changeVote")}
        </a>
      </div>
    );
  }

  return (
    <div className="vote-buttons__button-container">
      <button
        type="button"
        onClick={() => submitVote(VoteValue.Yes)}
        disabled={votePending || lacksGovernanceToken}
        className="vote-buttons__button"
      >
        {voteState === VoteState.Yes && votePending
          ? t("votePending")
          : t("voteFor")}
      </button>
      <button
        type="button"
        onClick={() => submitVote(VoteValue.No)}
        disabled={votePending || lacksGovernanceToken}
        className="vote-buttons__button"
      >
        {voteState === VoteState.No && votePending
          ? t("votePending")
          : t("voteAgainst")}
      </button>
      {voteState === VoteState.Failed && (
        <p className="vote-buttons__error-message text-error">
          {t("voteError")}
        </p>
      )}
    </div>
  );
};
