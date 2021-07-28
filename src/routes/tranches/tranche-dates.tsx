import { format } from "date-fns";

interface TrancheDatesParams {
  start: Date
  end: Date
}

export const TrancheDates = ({ start, end }: TrancheDatesParams) => {
  const startDate = new Date(start).getTime()  
  const endDate = new Date(end).getTime()  

  let prefix, dates = ''

  if (start === end) {
    prefix = 'Fully vested on'
    dates = format(startDate, "MMM d, yyyy")
  } else {
    prefix = 'Vesting from'
    dates = `${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")}` 
  }
  return (
    <span>
      {prefix}{" "}
      {dates}
    </span>
  );
};
