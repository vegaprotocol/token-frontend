import { format } from "date-fns";
import { useTranslation } from 'react-i18next'

interface TrancheDatesParams {
  start: Date
  end: Date
}

export const TrancheDates = ({ start, end }: TrancheDatesParams) => {
  const { t } = useTranslation()
  const startDate = new Date(start).getTime()  
  const endDate = new Date(end).getTime()  

  if (start === end) {
    return (
      <span>
        {t("Fully vested on")}
        {format(startDate, "MMM d, yyyy")}
      </span>
    )
  } else {
    return (<span>
      {t("Vesting from")}{" "}
      {format(startDate, "MMM d, yyyy")}{" "}
      {t("to")}{" "}
      {" "}
      {format(endDate, "MMM d, yyyy")}
    </span>)
  } 
};
