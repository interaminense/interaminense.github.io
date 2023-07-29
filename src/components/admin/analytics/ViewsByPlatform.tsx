import { YAxis, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { useAnalyticsData } from "../../../analytics";
import { Card } from "../Card";
import { COLORS } from "../../../utils/constants";

interface DataItem {
  createDate: number;
  id: string;
  properties: {
    label: string;
    platform: string;
    url: string;
  };
}

interface NewObjectItem {
  name: string;
  total: number;
}

function generateNewObject(data: DataItem[], name: string): NewObjectItem[] {
  const plataformCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const platform = JSON.parse(item.properties.platform)[name].name;

    if (plataformCounts[platform]) {
      plataformCounts[platform]++;
    } else {
      plataformCounts[platform] = 1;
    }
  });

  const newData: NewObjectItem[] = [];

  for (const platform in plataformCounts) {
    newData.push({ name: platform, total: plataformCounts[platform] });
  }

  return newData;
}

export function ViewsByPlatform({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  const data = useAnalyticsData("pageViewed");
  const result = generateNewObject(data?.data ?? [], name);

  if (!result) return null;

  const top5Result = result.sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <Card title={title}>
      <BarChart width={520} height={400} data={top5Result}>
        <Tooltip />
        <Bar dataKey="total" fill={COLORS[0]} />
        <XAxis dataKey="name" />
        <YAxis dataKey="total" />
      </BarChart>
    </Card>
  );
}
