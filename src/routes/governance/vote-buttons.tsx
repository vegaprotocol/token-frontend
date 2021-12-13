import "./vote-buttons.scss";
import { format } from "date-fns";

import * as React from "react";
import { VoteState } from "./use-user-vote";
import { ProposalState, VoteValue } from "../../__generated__/globalTypes";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import { useVegaUser } from "../../hooks/use-vega-user";
import {
  VoteButtons as VoteButtonsQueryResult,
  VoteButtonsVariables,
} from "./__generated__/VoteButtons";
import { BigNumber } from "../../lib/bignumber";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";

interface VoteButtonsContainerProps {
  voteState: VoteState | null;
  castVote: (vote: VoteValue) => void;
  voteDatetime: Date | null;
  proposalState: ProposalState;
}

const VOTE_BUTTONS_QUERY = gql`
  query VoteButtons($partyId: ID!) {
    party(id: $partyId) {
      id
      stake {
        currentStakeAvailable
        currentStakeAvailableFormatted @client
      }
    }
  }
`;

export const VoteButtonsContainer = (props: VoteButtonsContainerProps) => {
  const { currVegaKey } = useVegaUser();
  const { data, loading } = useQuery<
    VoteButtonsQueryResult,
    VoteButtonsVariables
  >(VOTE_BUTTONS_QUERY, {
    variables: { partyId: currVegaKey?.pub || "" },
    skip: !currVegaKey?.pub,
  });

  if (loading) return null;

  return (
    <VoteButtons
      {...props}
      currentStakeAvailable={
        new BigNumber(data?.party?.stake.currentStakeAvailableFormatted || 0)
      }
    />
  );
};

interface VoteButtonsProps extends VoteButtonsContainerProps {
  currentStakeAvailable: BigNumber;
}

export const VoteButtons = ({
  voteState,
  castVote,
  voteDatetime,
  proposalState,
  currentStakeAvailable,
}: VoteButtonsProps) => {
  const { t } = useTranslation();
  const { appDispatch } = useAppState();
  const { currVegaKey } = useVegaUser();
  const [changeVote, setChangeVote] = React.useState(false);

  const cantVoteUI = React.useMemo(() => {
    if (proposalState !== ProposalState.Open) {
      return t("youDidNotVote");
    }

    if (!currVegaKey) {
      // TODO: i18n
      return (
        <>
          <button
            type="button"
            className="button-link"
            onClick={() =>
              appDispatch({
                type: AppStateActionType.SET_VEGA_WALLET_OVERLAY,
                isOpen: true,
              })
            }
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {t("connectVegaWallet")}
          </button>{" "}
          {t("toVote")}
        </>
      );
    }

    if (currentStakeAvailable.isLessThanOrEqualTo(0)) {
      return t("noGovernanceTokens");
    }

    return false;
  }, [t, currVegaKey, currentStakeAvailable, proposalState, appDispatch]);

  function submitVote(vote: VoteValue) {
    setChangeVote(false);
    castVote(vote);
  }

  // Should only render null for a split second while initial vote state
  // null is set to either Yes, No or NotCast
  if (!voteState) {
    return null;
  }

  if (cantVoteUI) {
    return <p>{cantVoteUI}</p>;
  }

  if (voteState === VoteState.Pending) {
    return <p>{t("votePending")}...</p>;
  }

  // If voted show current vote info`
  if (
    !changeVote &&
    (voteState === VoteState.Yes || voteState === VoteState.No)
  ) {
    const className = voteState === VoteState.Yes ? "text-green" : "text-red";
    return (
      <p>
        <span>{t("youVoted")}</span>{" "}
        <span className={className}>{t(`voteState_${voteState}`)}</span>
        {". "}
        {voteDatetime ? (
          <span>{format(voteDatetime, "d MMM yyyy")}. </span>
        ) : null}
        {proposalState === ProposalState.Open ? (
          <button
            className="button-link text-yellow"
            onClick={() => {
              setChangeVote(true);
            }}
          >
            {t("changeVote")}
          </button>
        ) : null}
      </p>
    );
  }

  if (!changeVote && voteState === VoteState.Failed) {
    return <p>{t("voteError")}</p>;
  }

  return (
    <div className="vote-buttons">
      <div className="vote-buttons__button-container">
        <button
          type="button"
          onClick={() => submitVote(VoteValue.Yes)}
          className="vote-buttons__button"
        >
          {t("voteFor")}
        </button>
        <button
          type="button"
          onClick={() => submitVote(VoteValue.No)}
          className="vote-buttons__button"
        >
          {t("voteAgainst")}
        </button>
      </div>
    </div>
  );
};
