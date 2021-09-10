import "./vote-buttons.scss";

import { Button } from "@blueprintjs/core";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { VoteState } from "./use-user-vote";
import { VoteValue } from "../../__generated__/globalTypes";
import { Colors } from "../../config";
import { useAppState } from "../../contexts/app-state/app-state-context";

interface VoteButtonsProps {
  voteState: VoteState;
  castVote: (vote: VoteValue) => void;
  voteDatetime: string | null;
  votePending: boolean;
}

export const VoteButtons = ({
  voteState,
  castVote,
  voteDatetime,
  votePending,
}: VoteButtonsProps) => {
  // const { accounts } = useAccount(pubkey)
  const [changeVote, setChangeVote] = React.useState(false);
  // const account = accounts.find(
  //   a => a.asset.id === governance.vote.VOTE_ASSET_ID
  // )
  // const lacksGovernanceToken = !account || account.total === '0'
  const lacksGovernanceToken = false;

  const history = useHistory();
  const {
    appState: { currVegaKey },
    appDispatch,
  } = useAppState();
  const pubkey = currVegaKey ? currVegaKey.pub : null;
  const isAuth = !!currVegaKey;
  // const { isAuth } = useWalletState()

  if (!isAuth) {
    return <div>link to wallet</div>;
    // return <ConnectToWalletAsLink />
  }

  if (lacksGovernanceToken) {
    return (
      <span className="vote-buttons__container">
        {"i18n.GOVERNANCE.youNeed"}
        {"i18n.GOVERNANCE.toVote"}
      </span>
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
        <span>{"i18n.GOVERNANCE.youVoted"}</span>{" "}
        <span style={{ color: voteColor }}>{"i18n.VOTE_STATE[voteState]"}</span>
        {". "}
        {voteDatetime ? (
          <span>{voteDatetime}. </span>
        ) : // <span>{format(new Date(voteDatetime), DateFormats.DATE_TIME)}. </span>
        null}
        {/* <ButtonLink */}
        <button
          onClick={() => {
            setChangeVote(true);
          }}
        >
          "i18n.GOVERNANCE.changeVote
        </button>
      </div>
    );
  }

  return (
    <div className="vote-buttons__button-container">
      <Button
        onClick={() => submitVote(VoteValue.Yes)}
        disabled={!pubkey || votePending || lacksGovernanceToken}
        className="vote-buttons__button"
      >
        {voteState === VoteState.Yes && votePending
          ? "i18n.GOVERNANCE.votePending"
          : "i18n.VOTE_STATE.Yes"}
      </Button>
      <Button
        onClick={() => submitVote(VoteValue.No)}
        disabled={!pubkey || votePending || lacksGovernanceToken}
        className="vote-buttons__button"
      >
        {voteState === VoteState.No && votePending
          ? "i18n.GOVERNANCE.votePending"
          : "i18n.VOTE_STATE.No"}
      </Button>
      {voteState === VoteState.Failed && (
        <p className="vote-buttons__error-message text-error">
          {"i18n.GOVERNANCE.voteError"}
        </p>
      )}
    </div>
  );
};
