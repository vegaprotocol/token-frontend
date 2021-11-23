import "./vote-details.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { Proposals_proposals } from "./__generated__/Proposals";
import { VoteButtons } from "./vote-buttons";
import { useUserVote } from "./use-user-vote";
import { gql, useQuery } from "@apollo/client";
import { Parties } from "./__generated__/Parties";
import { SplashScreen } from "../../components/splash-screen";
import { SplashLoader } from "../../components/splash-loader";
import { Callout } from "../../components/callout";

export const PARTIES_QUERY = gql`
  query Parties {
    parties {
      id
      stake {
        currentStakeAvailable
        currentStakeAvailableFormatted @client
      }
    }
  }
`;

interface VoteDetailsProps {
  proposal: Proposals_proposals;
}

export const VoteDetails = ({ proposal }: VoteDetailsProps) => {
  const { t } = useTranslation();
  const { voteState, votePending, voteDatetime, castVote } = useUserVote(
    proposal.id,
    proposal.votes.yes.votes,
    proposal.votes.no.votes
  );

  const { data, loading, error } = useQuery<Parties>(PARTIES_QUERY);

  const party = React.useMemo(() => {
    if (!data || !data.parties || data.parties?.length === 0) {
      return null;
    }

    return data.parties.find((party) => party.id === proposal.party.id);
  }, [data, proposal.party.id]);

  if (loading) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (error) {
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <p>{t("partiesQueryFailed")}</p>
      </Callout>
    );
  }
  return (
    <section>
      <h4 className="proposal__sub-title">{t("yourVote")}</h4>
      <VoteButtons
        party={party}
        voteState={voteState}
        castVote={castVote}
        voteDatetime={voteDatetime}
        votePending={votePending}
        proposalState={proposal.state}
      />
    </section>
  );
};
