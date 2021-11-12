import "./withdraw-pending.scss";
import React from "react";
import { gql, useQuery } from "@apollo/client";
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
import { useContracts } from "../../contexts/contracts/contracts-context";
import { useTransaction } from "../../hooks/use-transaction";
import { addDecimal } from "../../lib/decimals";
import { BigNumber } from "../../lib/bignumber";
import { TransactionButton } from "../../components/transaction-button";
import { usePollERC20Approval } from "../../hooks/use-ercPoll20Approval";
import orderBy from "lodash/orderBy";
import { TxState } from "../../hooks/transaction-reducer";

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
    // This must be network-only because you are navigated to this page automatically after the withdrawal is created,
    // if you have already visited this page the query result is cached with 0 withdrawals, so we need to refetch every
    // time to ensure the withdrawal is shown immediately
    fetchPolicy: "network-only",
  });

  const withdrawals = React.useMemo(() => {
    if (!data?.party?.withdrawals?.length) return [];

    return orderBy(
      data.party.withdrawals,
      [(w) => new Date(w.createdTimestamp)],
      ["desc"]
    );
  }, [data]);

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

  if (!withdrawals.length) {
    return <p>You dont have any pending withdrawals</p>;
  }

  return (
    <ul className="withdrawals-list">
      {withdrawals.map((w) => (
        <li>
          <Withdrawal withdrawal={w} />
        </li>
      ))}
    </ul>
  );
};

interface WithdrawalProps {
  withdrawal: WithdrawsPending_party_withdrawals;
}

export const Withdrawal = ({ withdrawal }: WithdrawalProps) => {
  const { chainId } = useWeb3();
  const erc20Approval = usePollERC20Approval(withdrawal.id);
  const { erc20Bridge } = useContracts();
  const { state, perform, reset } = useTransaction(() => {
    if (!erc20Approval) {
      throw new Error("Withdraw needs approval object");
    }
    if (!withdrawal.details?.receiverAddress) {
      throw new Error("Missing receiver address");
    }

    return erc20Bridge.withdraw({
      assetSource: erc20Approval.assetSource,
      amount: erc20Approval.amount,
      expiry: erc20Approval.expiry,
      nonce: erc20Approval.nonce,
      signatures: erc20Approval.signatures,
      // TODO: switch when targetAddress is populated and deployed to mainnet data.erc20WithdrawalApproval.targetAddress,
      targetAddress: withdrawal.details.receiverAddress,
    });
  }, 6);

  return (
    <div>
      <KeyValueTable>
        <KeyValueTableRow>
          <th>Withdraw</th>
          <td>
            {addDecimal(
              new BigNumber(withdrawal.amount),
              withdrawal.asset.decimals
            )}{" "}
            {withdrawal.asset.symbol}
          </td>
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
          <td title={erc20Approval?.signatures}>
            {!erc20Approval?.signatures
              ? "Loading..."
              : truncateMiddle(erc20Approval.signatures)}
          </td>
        </KeyValueTableRow>
      </KeyValueTable>
      <TransactionButton
        transactionState={state}
        forceTxState={withdrawal.txHash ? TxState.Complete : undefined}
        disabled={!erc20Approval}
        start={perform}
        reset={reset}
      />
    </div>
  );
};
