export const TransactionError = ({ error }: { error: Error | null }) => {
  return <div>{error?.message || "Unknown error"}</div>;
};
