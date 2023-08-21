import { YAxis, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { useAnalyticsData } from "../../../analytics";
import { Card } from "../Card";
import { COLORS } from "../../../utils/constants";
import { transformData } from "../../../utils/transform";

export function ViewsByPlatform({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  const data = useAnalyticsData("pageViewed");
  const result = transformData(
    data,
    (item) => JSON.parse(item.properties.platform)[name].name
  );

  return (
    <Card title={title}>
      {result.length ? (
        <BarChart
          width={520}
          height={400}
          data={result?.sort((a, b) => b.total - a.total).slice(0, 5)}
        >
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
