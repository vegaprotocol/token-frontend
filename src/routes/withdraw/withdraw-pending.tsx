import { ApolloError, gql, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { EtherscanLink } from "../../components/etherscan-link";
import { Heading } from "../../components/heading";
import {
  KeyValueTable,
  KeyValueTableRow,
} from "../../components/key-value-table";
import { SplashLoader } from "../../components/splash-loader";
import { SplashScreen } from "../../components/splash-screen";
import { VegaWalletContainer } from "../../components/vega-wallet-container";
import { VegaKeyExtended } from "../../contexts/app-state/app-state-context";
import { useWeb3 } from "../../contexts/web3-context/web3-context";
import { truncateMiddle } from "../../lib/truncate-middle";
import {
  WithdrawsPending,
  WithdrawsPendingVariables,
  WithdrawsPending_party_withdrawals,
} from "./__generated__/WithdrawsPending";
import { format } from "date-fns";
import {
  Erc20Approval,
  Erc20ApprovalVariables,
} from "./__generated__/Erc20Approval";
import {
  TransactionAction,
  TransactionActionType,
  TxState,
} from "../../hooks/transaction-reducer";
import { useContracts } from "../../contexts/contracts/contracts-context";
import { useTransaction } from "../../hooks/use-transaction";

export const WithdrawPending = () => {
  return (
    <>
      <Heading title="Incomplete withdrawals" />
      <p>These withdrawals need to be complete with an Ethereum transaction.</p>
      <VegaWalletContainer>
        {(currVegaKey) => (
          <WithdrawPendingContainer currVegaKey={currVegaKey} />
        )}
      </VegaWalletContainer>
    </>
  );
};

interface WithdrawPendingContainerProps {
  currVegaKey: VegaKeyExtended;
}

const WITHDRAW_PENDING_QUERY = gql`
  query WithdrawsPending($partyId: ID!) {
    party(id: $partyId) {
      id
      withdrawals {
        id
        amount
        asset {
          id
          symbol
          decimals
        }
        party {
          id
        }
        status
        createdTimestamp
        withdrawnTimestamp
        txHash
        details {
          ... on Erc20WithdrawalDetails {
            receiverAddress
          }
        }
      }
    }
  }
`;

const WithdrawPendingContainer = ({
  currVegaKey,
}: WithdrawPendingContainerProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery<
    WithdrawsPending,
    WithdrawsPendingVariables
  >(WITHDRAW_PENDING_QUERY, {
    variables: { partyId: currVegaKey.pub },
  });

  if (error) {
    return (
      <section>
        <p>{t("Something went wrong")}</p>
        {error && <pre>{error.message}</pre>}
      </section>
    );
  }

  if (loading || !data) {
    return (
      <SplashScreen>
        <SplashLoader />
      </SplashScreen>
    );
  }

  if (!data.party?.withdrawals?.length) {
    return <p>You dont have any pending withdrawals</p>;
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {data.party.withdrawals.map((w) => (
        <li key={w.id} style={{ marginBottom: 25 }}>
          <Withdrawal withdrawal={w} />
        </li>
      ))}
    </ul>
  );
};

interface WithdrawalProps {
  withdrawal: WithdrawsPending_party_withdrawals;
}

const ERC20_APPROVAL_QUERY = gql`
  query Erc20Approval($withdrawalId: ID!) {
    erc20WithdrawalApproval(withdrawalId: $withdrawalId) {
      assetSource
      amount
      nonce
      signatures
      targetAddress
      expiry
    }
  }
`;

export const Withdrawal = ({ withdrawal }: WithdrawalProps) => {
  const { chainId } = useWeb3();
  const { data, loading, error } = useQuery<
    Erc20Approval,
    Erc20ApprovalVariables
  >(ERC20_APPROVAL_QUERY, {
    variables: { withdrawalId: withdrawal.id },
  });

  const { erc20Bridge } = useContracts();
  const { state, perform, dispatch } = useTransaction(() => {
    if (!data?.erc20WithdrawalApproval) {
      throw new Error("Withdraw needs approval object");
    }

    return erc20Bridge.withdraw({
      assetSource: data.erc20WithdrawalApproval.assetSource,
      amount: data.erc20WithdrawalApproval.amount,
      expiry: data.erc20WithdrawalApproval.expiry,
      nonce: data.erc20WithdrawalApproval.nonce,
      signatures: data.erc20WithdrawalApproval.signatures,
      targetAddress: data.erc20WithdrawalApproval.targetAddress,
    });
  });

  return (
    <div>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>Withdraw</th>
          <td>{withdrawal.amount}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>From</th>
          <td>{truncateMiddle(withdrawal.party.id)}</td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>To (Ethereum)</th>
          <td>
            <EtherscanLink
              chainId={chainId}
              address={withdrawal.details?.receiverAddress as string}
              text={truncateMiddle(
                withdrawal.details?.receiverAddress as string
              )}
            />
            {}
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Created</th>
          <td>
            {format(new Date(withdrawal.createdTimestamp), "dd MMM yyyy HH:mm")}
          </td>
        </KeyValueTableRow>
        <KeyValueTableRow>
          <th>Signature</th>
          <td title={data?.erc20WithdrawalApproval?.signatures}>
            {error
              ? "Could not retrieve signature"
              : loading || !data?.erc20WithdrawalApproval?.signatures
              ? "Loading..."
              : truncateMiddle(data.erc20WithdrawalApproval.signatures)}
          </td>
        </KeyValueTableRow>
      </KeyValueTable>
      <CompleteButton
        error={error}
        txState={state.txState}
        dispatch={dispatch}
        onClick={perform}
      />
    </div>
  );
};

const CompleteButton = ({
  error,
  txState,
  dispatch,
  onClick,
}: {
  error: ApolloError | undefined;
  txState: TxState;
  dispatch: React.Dispatch<TransactionAction>;
  onClick: () => void;
}) => {
  let text = "Finish withdraw";
  let disabled = false;

  if (error) {
    text = "Coult not load approval";
    disabled = true;
  } else if (txState === TxState.Requested) {
    text = "Action required in Ethereum wallet";
    disabled = true;
  } else if (txState === TxState.Pending) {
    text = "Submitting Ethereum transaction";
    disabled = true;
  } else if (txState === TxState.Error) {
    return (
      <>
        <p>Ethereum transaction failed</p>
        <button
          onClick={() => dispatch({ type: TransactionActionType.TX_RESET })}
        >
          Try again
        </button>
      </>
    );
  } else if (txState === TxState.Complete) {
    return <p>Complete</p>;
  }

  return (
    <button onClick={onClick} className="fill" disabled={disabled}>
      {text}
    </button>
  );
};
