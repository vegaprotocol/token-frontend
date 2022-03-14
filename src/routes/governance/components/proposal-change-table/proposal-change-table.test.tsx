import { render, screen } from "@testing-library/react";
import { format } from "date-fns";

import {
  ProposalRejectionReason,
  ProposalState,
} from "../../../../__generated__/globalTypes";
import { DATE_FORMAT_DETAILED } from "../../../../lib/date-formats";
import { generateProposal } from "../../test-helpers/generate-proposals";
import { ProposalChangeTable } from "./proposal-change-table";

it("Renders with data-testid", () => {
  const proposal = generateProposal();
  render(<ProposalChangeTable proposal={proposal} />);
  expect(screen.getByTestId("proposal-change-table")).toBeInTheDocument();
});

it("Renders all data for table", () => {
  const proposal = generateProposal();
  render(<ProposalChangeTable proposal={proposal} />);
  expect(screen.queryByText("id")).toBeInTheDocument();
  expect(screen.queryByText(proposal.id!)).toBeInTheDocument();

  expect(screen.queryByText("state")).toBeInTheDocument();
  expect(screen.queryByText("Open")).toBeInTheDocument();

  expect(screen.queryByText("closesOn")).toBeInTheDocument();
  expect(
    screen.queryByText(
      format(new Date(proposal.terms.closingDatetime), DATE_FORMAT_DETAILED)
    )
  ).toBeInTheDocument();

  expect(screen.queryByText("proposedEnactment")).toBeInTheDocument();
  expect(
    screen.queryByText(
      format(new Date(proposal.terms.enactmentDatetime), DATE_FORMAT_DETAILED)
    )
  ).toBeInTheDocument();

  expect(screen.queryByText("proposedBy")).toBeInTheDocument();
  expect(screen.queryByText(proposal.party.id!)).toBeInTheDocument();

  expect(screen.queryByText("proposedOn")).toBeInTheDocument();
  expect(
    screen.queryByText(
      format(new Date(proposal.datetime), DATE_FORMAT_DETAILED)
    )
  ).toBeInTheDocument();

  expect(screen.queryByText("type")).toBeInTheDocument();
  expect(
    screen.queryByText(proposal.terms.change.__typename)
  ).toBeInTheDocument();
});

it("Changes data based on if data is in future or past", () => {
  const proposal = generateProposal({
    state: ProposalState.Enacted,
  });
  render(<ProposalChangeTable proposal={proposal} />);

  expect(screen.queryByText("state")).toBeInTheDocument();
  expect(screen.queryByText("Enacted")).toBeInTheDocument();

  expect(screen.queryByText("closedOn")).toBeInTheDocument();
  expect(
    screen.queryByText(
      format(new Date(proposal.terms.closingDatetime), DATE_FORMAT_DETAILED)
    )
  ).toBeInTheDocument();

  expect(screen.queryByText("enactedOn")).toBeInTheDocument();
  expect(
    screen.queryByText(
      format(new Date(proposal.terms.enactmentDatetime), DATE_FORMAT_DETAILED)
    )
  ).toBeInTheDocument();
});

it("Renders error details and rejection reason if present", () => {
  const proposal = generateProposal({
    errorDetails: "Error details",
    rejectionReason: ProposalRejectionReason.CloseTimeTooLate,
  });
  render(<ProposalChangeTable proposal={proposal} />);
  expect(screen.queryByText("errorDetails")).toBeInTheDocument();
  expect(screen.queryByText("Error details")).toBeInTheDocument();

  expect(screen.queryByText("rejectionReason")).toBeInTheDocument();
  expect(
    screen.queryByText(ProposalRejectionReason.CloseTimeTooLate)
  ).toBeInTheDocument();
});
