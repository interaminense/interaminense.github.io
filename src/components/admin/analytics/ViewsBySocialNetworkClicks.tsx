import { YAxis, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { useAnalyticsData } from "../../../analytics";
import { Card } from "../Card";
import { COLORS } from "../../../utils/constants";
import { transformData } from "../../../utils/transform";

export function ViewsBySocialNetworkClicks() {
  const data = useAnalyticsData("clickOnSocialNetworkLink");
  const result = transformData(data, (item) =>
    item.properties.label.toLowerCase()
  );

  return (
    <Card title="VIEWS BY SOCIAL NETWORK CLICKS">
      {result.length ? (
        <BarChart width={520} height={400} data={result}>
          <Tooltip />
          <Bar dataKey="total" fill={COLORS[0]} />
          <XAxis dataKey="name" />
          <YAxis dataKey="total" />
        </BarChart>
      ) : (
        <Card.Empty height={400} />
      )}
    </Card>
  );
}
