export const TransactionsInProgress = ({ hash }: { hash: string | null }) => {
  return (
    <div>
      Transaction in progress.{" "}
      <a href={`https://etherscan.io/tx/${hash}`}>View on Etherscan</a>
    </div>
  );
};
