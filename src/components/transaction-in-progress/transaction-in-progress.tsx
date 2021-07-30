import "./transaction-in-progress.scss";

export const TransactionsInProgress = ({ hash }: { hash: string | null }) => {
  return (
    <div className="transaction-in-progress">
      Transaction in progress.{" "}
      <div>
        <a href={`https://etherscan.io/tx/${hash}`}>View on Etherscan</a>
      </div>
    </div>
  );
};
