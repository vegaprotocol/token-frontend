import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface TrancheDatesParams {
  start: Date;
  end: Date;
}

export const TrancheDates = ({ start, end }: TrancheDatesParams) => {
  const { t } = useTranslation();
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  if (startDate === endDate) {
    return (
      <span>
        {t("Fully vested on", { date: format(startDate, "d MMM yyyy") })}
      </span>
    );
  } else {
    return (
      <span>
        {t("Vesting from", {
          fromDate: format(startDate, "d MMM yyyy"),
          endDate: format(endDate, "d MMM yyyy"),
        })}
      </span>
    );
  }
};
