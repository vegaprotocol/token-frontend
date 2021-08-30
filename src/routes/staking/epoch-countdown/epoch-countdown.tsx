import "./epoch-countdown.scss";

import { Intent, ProgressBar } from "@blueprintjs/core";
import { format, formatDistanceStrict } from "date-fns";
import * as React from "react";
import { useTranslation } from "react-i18next";

export const DATE_FORMAT = "yyyy.MM.dd HH:mm";

export interface EpochCountdownProps {
  id: string;
  startDate: Date;
  endDate: Date;
  containerClass?: string;
}

export function EpochCountdown({
  id,
  startDate,
  endDate,
  containerClass,
}: EpochCountdownProps) {
  const { t } = useTranslation();
  const [now, setNow] = React.useState(Date.now());

  // number between 0 and 1 for percentage progress
  const progress = React.useMemo(() => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    // round it to make testing easier
    return Number(((now - start) / (end - start)).toFixed(2));
  }, [startDate, endDate, now]);

  // format end date into readable 'time until' text
  const endsIn = React.useMemo(() => {
    return formatDistanceStrict(now, endDate);
  }, [now, endDate]);

  // start interval updating current time stamp until
  // its passed the end date
  React.useEffect(() => {
    const interval = setInterval(() => {
      const d = Date.now();
      setNow(d);

      if (d > endDate.getTime()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div
      data-testid="epoch-countdown"
      className={`${containerClass} epoch-countdown`}
    >
      <h3>
        {t("Epoch")} {id}
      </h3>
      <ProgressBar
        animate={false}
        value={progress}
        stripes={false}
        intent={Intent.NONE}
      />
      <p>
        {t("Started")} {format(startDate, DATE_FORMAT)}
      </p>
      <p>
        {t("Ends in")} ~{endsIn}
      </p>
    </div>
  );
}
