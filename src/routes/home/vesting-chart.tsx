import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "./data.json";
import { Colors } from "../../colors";
import { format, startOfMonth } from "date-fns";

export const VestingChart = () => {
  const { t } = useTranslation();
  return (
    <ResponsiveContainer height={400} width="100%">
      <AreaChart data={data}>
        <Tooltip contentStyle={{ backgroundColor: Colors.BLACK }} />
        <XAxis dataKey="date" />
        <YAxis type="number" width={80} />
        <ReferenceLine
          x={format(startOfMonth(new Date()), "yyyy-MM-dd")}
          stroke={Colors.WHITE}
          strokeWidth={2}
          label={{
            position: "right",
            value: "Today",
            fill: Colors.WHITE,
            fontSize: 12,
          }}
        />
        <Area
          dot={false}
          type="linear"
          dataKey="team"
          stroke={Colors.VEGA_GREEN}
          fill={Colors.VEGA_GREEN}
          yAxisId={0}
          strokeWidth={2}
          stackId="1"
          name={t("Team")}
        />
        <Area
          dot={false}
          type="monotone"
          dataKey="earlyInvestors"
          stroke={Colors.VEGA_RED}
          fill={Colors.VEGA_RED}
          yAxisId={0}
          strokeWidth={2}
          stackId="1"
          name={t("Early Investors")}
        />
        <Area
          dot={false}
          type="monotone"
          dataKey="publicSale"
          stroke={Colors.VEGA_YELLOW}
          fill={Colors.VEGA_YELLOW}
          yAxisId={0}
          strokeWidth={2}
          stackId="1"
          name={t("Public Sale")}
        />
        <Area
          dot={false}
          type="monotone"
          dataKey="community"
          stroke={Colors.PINK}
          fill={Colors.PINK}
          yAxisId={0}
          strokeWidth={2}
          stackId="1"
          name={t("Community")}
        />
        <Legend margin={{ top: 25 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
