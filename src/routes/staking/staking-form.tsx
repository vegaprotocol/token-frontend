import { FormGroup, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FormFields {
  amount: string;
  action: "add" | "remove" | undefined;
}

export const StakingForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>();

  const amount = useWatch({ control, name: "amount" });
  const action = useWatch({ control, name: "action" });

  function onSubmit(fields: FormFields) {
    console.log(fields);
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
              console.log(field);
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
