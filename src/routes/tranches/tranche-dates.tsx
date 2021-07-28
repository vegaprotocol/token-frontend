import { format } from "date-fns";
export const getTrancheDates = (tranche_start: Date, tranche_end: Date) => {
  const start = new Date(tranche_start).getTime()  
  const end = new Date(tranche_end).getTime()  
  if (start === end) {
    return (
      <span>
        Fully vested on{" "}
        {format(start, "MMM d, yyyy")}
      </span>
    );
  }
  return (
    <span>
      Vesting from{" "}
      {format(start, "MMM d, yyyy")} to{" "}
      {format(end, "MMM d, yyyy")}
    </span>
  );
};
