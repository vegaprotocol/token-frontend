import React from "react";
import { useTranslation } from "react-i18next";
import { ContractAssociate } from "./contract-associate";
import { WalletAssociate } from "./wallet-associate";
import {
  useAppState,
  VegaKeyExtended,
} from "../../../contexts/app-state/app-state-context";
import { TxState } from "../../../hooks/transaction-reducer";
import { AssociateTransaction } from "./associate-transaction";
import { useSearchParams } from "../../../hooks/use-search-params";
import {
  StakingMethod,
  StakingMethodRadio,
} from "../../../components/staking-method-radio";
import { useAddStake } from "./hooks";
import { BigNumber } from "../../../lib/bignumber";
import { useQuery, gql } from "@apollo/client";
import {
  PartyStakeLinkings,
  PartyStakeLinkingsVariables,
} from "./__generated__/PartyStakeLinkings";

export const AssociatePage = ({
  address,
  vegaKey,
  requiredConfirmations,
  minDelegation,
}: {
  address: string;
  vegaKey: VegaKeyExtended;
  requiredConfirmations: number;
  minDelegation: BigNumber;
}) => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [amount, setAmount] = React.useState<string>("");

  const stakingMethod = params.method as StakingMethod | "";
  const [selectedStakingMethod, setSelectedStakingMethod] = React.useState<
    StakingMethod | ""
  >(stakingMethod);

  const {
    state: txState,
    dispatch: txDispatch,
    perform: txPerform,
  } = useAddStake(
    address,
    amount,
    vegaKey.pub,
    selectedStakingMethod,
    requiredConfirmations
  );

  const linking = usePollForStakeLinking(vegaKey.pub, txState.txData.hash);

  const {
    appState: { walletBalance, totalVestedBalance },
  } = useAppState();

  const zeroVesting = totalVestedBalance.isEqualTo(0);
  const zeroVega = walletBalance.isEqualTo(0);

  if (txState.txState !== TxState.Default) {
    return (
      <AssociateTransaction
        amount={amount}
        vegaKey={vegaKey.pub}
        state={txState}
        dispatch={txDispatch}
        requiredConfirmations={requiredConfirmations}
      />
    );
  }

  return (
    <section data-testid="associate">
      <p data-testid="associate-information">
        {t(
          "To participate in Governance or to Nominate a node you’ll need to associate VEGA tokens with a Vega wallet/key. This Vega key can then be used to Propose, Vote and nominate nodes."
        )}
      </p>
      {zeroVesting && zeroVega ? null : (
        <>
          <h2 data-testid="associate-subheader">
            {t("Where would you like to stake from?")}
          </h2>
          <StakingMethodRadio
            setSelectedStakingMethod={setSelectedStakingMethod}
            selectedStakingMethod={selectedStakingMethod}
          />
        </>
      )}
      {selectedStakingMethod &&
        (selectedStakingMethod === StakingMethod.Contract ? (
          <ContractAssociate
            vegaKey={vegaKey}
            perform={txPerform}
            amount={amount}
            setAmount={setAmount}
            minDelegation={minDelegation}
          />
        ) : (
          <WalletAssociate
            address={address}
            vegaKey={vegaKey}
            perform={txPerform}
            amount={amount}
            setAmount={setAmount}
            minDelegation={minDelegation}
          />
        ))}
    </section>
  );
};

const PARTY_STAKE_LINKINGS = gql`
  query PartyStakeLinkings($partyId: ID!) {
    party(id: $partyId) {
      stake {
        linkings {
          id
          txHash
        }
      }
    }
  }
`;

function usePollForStakeLinking(partyId: string, txHash: string | null) {
  // Query for linkings under current connected party (vega key)
  const { data, startPolling, stopPolling } = useQuery<
    PartyStakeLinkings,
    PartyStakeLinkingsVariables
  >(PARTY_STAKE_LINKINGS, {
    variables: { partyId },
  });

  // Everytime we get data, find the matching linking by txHash
  const linking = React.useMemo(() => {
    const linkings = data?.party?.stake.linkings;

    if (linkings?.length) return;

    const matchingLinking = linkings?.find((l) => l.txHash === txHash);

    return matchingLinking;
  }, [data, txHash]);

  // Start and stop polling if we have a linking/txHash or if unmount
  React.useEffect(() => {
    // If we have the txHash of the transaction but no found linking start polling
    if (!linking && txHash) {
      startPolling(1000);
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling, linking, txHash]);

  return linking;
}
