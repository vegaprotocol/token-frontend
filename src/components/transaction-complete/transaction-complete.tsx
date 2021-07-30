import "./transaction-complete.scss";

export const TransactionComplete = ({ hash }: { hash: string | null }) => {
  return (
    <div className="transaction-complete">
      Complete
      <div>
        <a href={`https://etherscan.io/tx/${hash}`}>
          View on Etherscan (opens in a new tab)
        </a>
      </div>
    </div>
  );
};
