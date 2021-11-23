import "./vote-buttons.scss";
import { format } from "date-fns";

import * as React from "react";
import { VoteState } from "./use-user-vote";
import { ProposalState, VoteValue } from "../../__generated__/globalTypes";
import { Colors } from "../../config";
import {
  AppStateActionType,
  useAppState,
} from "../../contexts/app-state/app-state-context";
import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";
import { Error } from "../../components/icons";
import { useQuery, gql } from "@apollo/client";
import { useVegaUser } from "../../hooks/use-vega-user";
import {
  VoteButtons as VoteButtonsQueryResult,
  VoteButtonsVariables,
} from "./__generated__/VoteButtons";
import { BigNumber } from "../../lib/bignumber";

interface VoteButtonsContainerProps {
  voteState: VoteState;
  castVote: (vote: VoteValue) => void;
  voteDatetime: string | null;
  votePending: boolean;
  proposalState: ProposalState;
}

const VOTE_BUTTONS_QUERY = gql`
  query VoteButtons($partyId: ID!) {
    party(id: $partyId) {
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

  if (loading || !data?.party) return null;

  return (
    <VoteButtons
      {...props}
      currentStakeAvailable={
        new BigNumber(data.party.stake.currentStakeAvailableFormatted || 0)
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
  votePending,
  proposalState,
  currentStakeAvailable,
}: VoteButtonsProps) => {
  const { t } = useTranslation();
  const [changeVote, setChangeVote] = React.useState(false);
  const {
    appState: { currVegaKey },
    appDispatch,
  } = useAppState();

  const lacksGovernanceToken = currentStakeAvailable.isLessThanOrEqualTo(0);

  if (!currVegaKey) {
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
        {t("connectVegaWallet")}
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

  if (votePending) {
    return (
      <div className="vote-buttons__callout-container">
        <Callout icon={<Loader />} title={t("votePending")}>
          &nbsp;
        </Callout>
      </div>
    );
  }

  if (voteState === VoteState.Failed && !changeVote) {
    return (
      <div className="vote-buttons__callout-container">
        <Callout intent="error" icon={<Error />} title={t("voteError")}>
          {proposalState === ProposalState.Open ? (
            <button
              className="vote-buttons__link-button"
              onClick={() => {
                setChangeVote(true);
              }}
            >
              {t("back")}
            </button>
          ) : null}
        </Callout>
      </div>
    );
  }

  if (
    (voteState === VoteState.No || voteState === VoteState.Yes) &&
    !votePending &&
    !changeVote
  ) {
    return (
      <div className="vote-buttons__callout-container">
        <span>{t("youVoted")}</span>{" "}
        <span style={{ color: voteColor }}>{t(`voteState_${voteState}`)}</span>
        {voteDatetime ? (
          <span>
            {`${t("forThisProposal")} ${format(
              new Date(voteDatetime),
              "d MMM yyyy"
            )}`}
            .{" "}
          </span>
        ) : (
          ". "
        )}
        {proposalState === ProposalState.Open ? (
          <button
            className="vote-buttons__link-button"
            onClick={() => {
              setChangeVote(true);
            }}
          >
            {t("changeVote")}
          </button>
        ) : null}
      </div>
    );
  }

  if (proposalState === ProposalState.Open) {
    return (
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
    );
  }

  return <h3 className="vote-buttons__container">{t("youDidNotVote")}</h3>;
};
