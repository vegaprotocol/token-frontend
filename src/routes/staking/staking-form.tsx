import React from "react";
import * as Sentry from "@sentry/react";
import { FormGroup, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useVegaWallet } from "../../hooks/use-vega-wallet";
import { Callout } from "../../components/callout";
import { Loader } from "../../components/loader";
import { Tick } from "../../components/icons";
import { Link } from "react-router-dom";
import { Routes } from "../router-config";

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

interface FormFields {
  amount: string;
  action: "add" | "remove" | undefined;
}

interface StakingFormProps {
  nodeId: string;
}

export const StakingForm = ({ nodeId }: StakingFormProps) => {
  const [formState, setFormState] = React.useState(FormState.Default);
  const vegaWallet = useVegaWallet();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>();

  const amount = useWatch({ control, name: "amount" });
  const action = useWatch({ control, name: "action" });

  async function onSubmit(fields: FormFields) {
    setFormState(FormState.Pending);
    try {
      const [err] = await vegaWallet.commandSync({
        pubKey: "",
        delegateSubmission: {
          nodeId,
          amount: Number(fields.amount),
        },
      });

      if (err) {
        setFormState(FormState.Failure);
        Sentry.captureEvent(err);
      } else {
        setFormState(FormState.Success);
      }
    } catch (err) {
      setFormState(FormState.Failure);
      Sentry.captureEvent(err);
    }
  }

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
    return (
      <Callout
        icon={<Loader />}
        title={t("Adding {{amount}} VEGA to node {{node}}", {
          amount,
          node: nodeId,
        })}
      >
        <p>
          {t(
            "This should take approximately 3 minutes to confirm, and then will be credited at the beginning of the next epoch"
          )}
        </p>
      </Callout>
    );
  }

  if (formState === FormState.Success) {
    return (
      <Callout
        icon={<Tick />}
        title={t("{{amount}} has been added to node {{node}}", {
          amount,
          node: nodeId,
        })}
      >
        <p>{t("It will be applied in the next epoch")}</p>
        <p>
          <Link to={Routes.STAKING}>{t("Back to staking page")}</Link>
        </p>
        {/* TODO: Add link to rewards */}
      </Callout>
    );
  }

  return (
    <>
      <h2>{t("Manage your stake")}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          helperText={errors.action?.message}
          intent={errors.action?.message ? Intent.DANGER : Intent.NONE}
        >
          <Controller
            control={control}
            name="action"
            rules={{ required: "Required" }}
            render={({ field }) => {
              return (
                <RadioGroup
                  onChange={field.onChange}
                  selectedValue={field.value}
                  inline={true}
                >
                  <Radio value="add" label="Add" />
                  <Radio value="remove" label="Remove" />
                </RadioGroup>
              );
            }}
          />
        </FormGroup>
        {action !== undefined && (
          <>
            <FormGroup
              label="How much to add in next epoch"
              helperText={errors.amount?.message}
              intent={errors.amount?.message ? Intent.DANGER : Intent.NONE}
            >
              <input
                {...register("amount", { required: "Required" })}
                type="text"
              />
            </FormGroup>
            <button className="fill" type="submit">
              {action} {amount} VEGA tokens
            </button>
          </>
        )}
      </form>
    </>
  );
};
