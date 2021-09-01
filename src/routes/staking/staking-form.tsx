import "./staking-form.scss";

import React from "react";
import * as Sentry from "@sentry/react";
import { FormGroup, Radio, RadioGroup } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";
import { Tick } from "../../components/icons";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";
import { gql, useApolloClient } from "@apollo/client";
import {
  PartyDelegations,
  PartyDelegationsVariables,
} from "./__generated__/PartyDelegations";
import { TokenInput } from "../../components/token-input";
import BigNumber from "bignumber.js";
import {
  DelegateSubmissionInput,
  UndelegateSubmissionInput,
} from "../../lib/vega-wallet/vega-wallet-service";

export const PARTY_DELEGATIONS_QUERY = gql`
  query PartyDelegations($partyId: String!) {
    party(id: $partyId) {
      delegations {
        amount
        node {
          id
        }
        epoch
      }
    }
  }
`;

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

interface StakingFormProps {
  nodeId: string;
  pubkey: string;
}

export const StakingForm = ({ nodeId, pubkey }: StakingFormProps) => {
  const client = useApolloClient();
  const [formState, setFormState] = React.useState(FormState.Default);
  const vegaWallet = useVegaWallet();
  const { t } = useTranslation();
  const [action, setAction] = React.useState<"Add" | "Remove" | undefined>();
  const [amount, setAmount] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState(FormState.Pending);
    const delegateInput: DelegateSubmissionInput = {
      pubKey: pubkey,
      delegateSubmission: {
        nodeId,
        amount: Number(amount),
      },
    };
    const undelegateInput: UndelegateSubmissionInput = {
      pubKey: pubkey,
      undelegateSubmission: {
        nodeId,
        amount: Number(amount),
        method: "METHOD_AT_END_OF_EPOCH",
      },
    };
    try {
      const command = action === "Add" ? delegateInput : undelegateInput;
      const [err] = await vegaWallet.commandSync(command);

      if (err) {
        setFormState(FormState.Failure);
        Sentry.captureEvent(err);
        console.log("err", err);
      }

      // await success via poll
    } catch (err) {
      console.log("catch", err);
      setFormState(FormState.Failure);
      Sentry.captureEvent(err);
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
          })
          .then((res) => {
            const delegation = res.data.party?.delegations?.find((d) => {
              return d.node.id === nodeId; // && d.epoch === the next epoch?
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
    return (
      <Callout intent="error" title={t("Something went wrong")}>
        <p>
          {t("Failed to delegate to node {{node}}", {
            node: nodeId,
          })}
        </p>
      </Callout>
    );
  }

  if (formState === FormState.Pending) {
    const titleArgs = { amount, node: nodeId };
    const title =
      action === "Add"
        ? t("Adding {{amount}} VEGA to node {{node}}", titleArgs)
        : t("Removing {{amount}} VEGA from node {{node}}", titleArgs);
    return (
      <Callout icon={<Loader />} title={title}>
        <p>
          {t(
            "This should take approximately 3 minutes to confirm, and then will be credited at the beginning of the next epoch"
          )}
        </p>
      </Callout>
    );
  }

  if (formState === FormState.Success) {
    const titleArgs = { amount, node: nodeId };
    const title =
      action === "Add"
        ? t("{{amount}} VEGA has been added to node {{node}}", titleArgs)
        : t("{{amount}} VEGA has been removed from node {{node}}", titleArgs);
    return (
      <Callout icon={<Tick />} intent="success" title={title}>
        <p>{t("It will be applied in the next epoch")}</p>
        <p>
          <Link to={Routes.STAKING}>{t("Back to staking page")}</Link>
        </p>
        {/* TODO: Add link to rewards */}
      </Callout>
    );
  }

  // const onNewAction = (field: any) => {
  //   window.history.replaceState(null, "", `?action=${action}`);
  //   return field.onChange;
  // };

  return (
    <>
      <h2>{t("Manage your stake")}</h2>
      <form onSubmit={onSubmit} data-testid="stake-form">
        <FormGroup>
          <RadioGroup
            // @ts-ignore
            onChange={(e) => setAction(e.target.value)}
            selectedValue={action}
            inline={true}
          >
            <Radio value="Add" label="Add" data-testid="add-stake-radio" />
            <Radio
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
              amount={amount}
              setAmount={setAmount}
              maximum={new BigNumber(555)}
            />
            <button className="fill" type="submit">
              {`${action}${amount ? ` ${amount}` : ""}`} VEGA tokens
            </button>
          </>
        )}
      </form>
    </>
  );
};
