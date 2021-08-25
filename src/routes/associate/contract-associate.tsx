import { useTranslation } from "react-i18next";
import { Callout } from "../../components/callout";
import React from "react";
import { useAppState } from "../../contexts/app-state/app-state-context";
import { BigNumber } from "../../lib/bignumber";
import { AssociateAction, AssociateState } from "./associate-reducer";
import { AssociateFrom } from "./associate-form";

export const ContractAssociate = ({
  perform,
  state,
  dispatch,
}: {
  perform: () => void;
  state: AssociateState;
  dispatch: React.Dispatch<AssociateAction>;
}) => {
  const { t } = useTranslation();
  const {
    appState: { currVegaKey, balanceFormatted, lien },
  } = useAppState();

  const maximum = React.useMemo(() => {
    return new BigNumber(balanceFormatted).minus(lien!);
  }, [balanceFormatted, lien]);

  return (
    <section className="contract-associate" data-testid="contract-associate">
      <Callout>
        {t(
          "You can associate tokens while they are held in the vesting contract, when they unlock you will need to dissociate them before they can be redeemed."
        )}
      </Callout>
      <AssociateFrom
        state={state}
        maximum={maximum}
        dispatch={dispatch}
        pubKey={currVegaKey!.pub}
        perform={perform}
        requireApprove={false}
      />
    </section>
  );
};
