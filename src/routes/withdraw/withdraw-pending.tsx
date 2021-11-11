import { gql, useQuery } from "@apollo/client";
import { Button } from "@blueprintjs/core";
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
        <li key={w.id} style={{ marginBottom: 20 }}>
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
          <td>!! maybe !!</td>
        </KeyValueTableRow>
      </KeyValueTable>
      <Button fill={true}>Finish withdraw</Button>
    </div>
  );
};
