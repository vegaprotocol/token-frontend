import { BigNumber } from "../../lib/bignumber";

export interface AssociateState {
  error: Error | null;
  stakedBalance: BigNumber | null;
}

export const initialAssociateState: AssociateState = {
  error: null,
  stakedBalance: null,
};

export enum AssociateActionType {
  ERROR,
}

export type RedemptionAction = {
  type: AssociateActionType.ERROR;
  error: Error;
};

export function associateReducer(
  state: AssociateState,
  action: RedemptionAction
): AssociateState {
  switch (action.type) {
    case AssociateActionType.ERROR:
      return {
        ...state,
        error: action.error,
      };
  }
}
