import "./staking-form.scss";

import * as Sentry from "@sentry/react";

import {
  DelegateSubmissionInput,
  UndelegateSubmissionInput,
} from "../../lib/vega-wallet/vega-wallet-service";
import { FormGroup, Radio, RadioGroup } from "@blueprintjs/core";
import {
  PartyDelegations,
  PartyDelegationsVariables,
} from "./__generated__/PartyDelegations";
import { gql, useApolloClient } from "@apollo/client";

import { BigNumber } from "../../lib/bignumber";
import { Colors } from "../../config";
import React from "react";
import { StakeFailure } from "./stake-failure";
import { StakePending } from "./stake-pending";
import { StakeSuccess } from "./stake-success";
import { TokenInput } from "../../components/token-input";
import { removeDecimal } from "../../lib/decimals";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { useHistory } from "react-router-dom";
import { useSearchParams } from "../../hooks/use-search-params";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";

export const PARTY_DELEGATIONS_QUERY = gql`
  query PartyDelegations($partyId: ID!) {
    party(id: $partyId) {
      delegations {
        amount
        amountFormatted @client
        node {
          id
        }
        epoch
      }
    }
    epoch {
      id
    }
  }
`;

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

export type StakeAction = "Add" | "Remove" | undefined;

interface StakingFormProps {
  nodeId: string;
  pubkey: string;
  availableStakeToAdd: BigNumber;
  availableStakeToRemove: BigNumber;
}

export const StakingForm = ({
  nodeId,
  pubkey,
  availableStakeToAdd,
  availableStakeToRemove,
}: StakingFormProps) => {
  const params = useSearchParams();
  const history = useHistory();
  const client = useApolloClient();
  const { appState } = useAppState();
  const [formState, setFormState] = React.useState(FormState.Default);
  const vegaWallet = useVegaWallet();
  const { t } = useTranslation();
  const [action, setAction] = React.useState<StakeAction>(params.action);
  const [amount, setAmount] = React.useState("");

  const maxDelegation = React.useMemo(() => {
    if (action === "Add") {
      return availableStakeToAdd;
    }

    if (action === "Remove") {
      return availableStakeToRemove;
    }
  }, [action, availableStakeToAdd, availableStakeToRemove]);

  async function onSubmit() {
    setFormState(FormState.Pending);
    const delegateInput: DelegateSubmissionInput = {
      pubKey: pubkey,
      delegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(amount), appState.decimals),
      },
    };
    const undelegateInput: UndelegateSubmissionInput = {
      pubKey: pubkey,
      undelegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(amount), appState.decimals),
        method: "METHOD_AT_END_OF_EPOCH",
      },
    };
    try {
      const command = action === "Add" ? delegateInput : undelegateInput;
      const [err] = await vegaWallet.commandSync(command);

      if (err) {
        setFormState(FormState.Failure);
        Sentry.captureException(err);
      }

      // await success via poll
    } catch (err) {
      setFormState(FormState.Failure);
      Sentry.captureException(err);
    }
  }

  React.useEffect(() => {
    let interval: any;

    if (formState === FormState.Pending) {
      // start polling for delegation
      interval = setInterval(() => {
        client
          .query<PartyDelegations, PartyDelegationsVariables>({
            query: PARTY_DELEGATIONS_QUERY,
            variables: { partyId: pubkey },
            fetchPolicy: "network-only",
          })
          .then((res) => {
            const delegation = res.data.party?.delegations?.find((d) => {
              return (
                d.node.id === nodeId && d.epoch.toString() === res.data.epoch.id
              );
            });

            if (delegation) {
              setFormState(FormState.Success);
              clearInterval(interval);
            }
          })
          .catch((err) => console.log(err));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [formState, client, pubkey, nodeId]);

  if (formState === FormState.Failure) {
    return <StakeFailure nodeId={nodeId} />;
  } else if (formState === FormState.Pending) {
    return <StakePending action={action} amount={amount} nodeId={nodeId} />;
  } else if (formState === FormState.Success) {
    return <StakeSuccess action={action} amount={amount} nodeId={nodeId} />;
  } else if (
    availableStakeToAdd.isEqualTo(0) &&
    availableStakeToRemove.isEqualTo(0)
  ) {
    if (appState.lien.isGreaterThan(0)) {
      return (
        <span style={{ color: Colors.RED }}>{t("stakeNodeWrongVegaKey")}</span>
      );
    } else {
      return <span style={{ color: Colors.RED }}>{t("stakeNodeNone")}</span>;
    }
  }

  return (
    <>
      <h2>{t("Manage your stake")}</h2>
      <FormGroup>
        <RadioGroup
          onChange={(e) => {
            // @ts-ignore
            const value = e.target.value;
            setAction(value);
            history.replace({
              pathname: history.location.pathname,
              search: `?action=${value}`,
            });
          }}
          selectedValue={action}
          inline={true}
        >
          <Radio
            disabled={availableStakeToAdd.isEqualTo(0)}
            value="Add"
            label="Add"
            data-testid="add-stake-radio"
          />
          <Radio
            disabled={availableStakeToRemove.isEqualTo(0)}
            value="Remove"
            label="Remove"
            data-testid="remove-stake-radio"
          />
        </RadioGroup>
      </FormGroup>
      {action !== undefined && (
        <>
          <h2>{t("How much to {{action}} in next epoch?", { action })}</h2>
          <TokenInput
            submitText={`${action} ${amount ? amount : ""} ${t("vegaTokens")}`}
            perform={onSubmit}
            amount={amount}
            setAmount={setAmount}
            maximum={maxDelegation}
            currency={t("VEGA Tokens")}
          />
        </>
      )}
    </>
  );
};
