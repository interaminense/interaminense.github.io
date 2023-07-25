import { XAxis, Tooltip, BarChart, Bar } from "recharts";
import { useAnalyticsData } from "../../../analytics";
import { Card } from "./Card";
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

function generateNewObject(data: DataItem[]): NewObjectItem[] {
  const labelCounts: { [key: string]: number } = {};
  data.forEach((item) => {
    const label = item.properties.label.toLowerCase();
    if (labelCounts[label]) {
      labelCounts[label]++;
    } else {
      labelCounts[label] = 1;
    }
  });

  const newData: NewObjectItem[] = [];

  for (const label in labelCounts) {
    newData.push({ name: label, total: labelCounts[label] });
  }

  return newData;
}

export function TotalClicksOnSocialNetwork() {
  const data = useAnalyticsData("clickOnSocialNetworkLink");
  const result = generateNewObject(data?.data ?? []);

  if (!result) return null;

  return (
    <Card title="TOTAL CLICKS ON SOCIAL NETWORK">
      <BarChart width={400} height={400} data={result}>
        <Tooltip />
        <Bar dataKey="total" fill={COLORS[0]} />
        <XAxis dataKey="name" />
      </BarChart>
    </Card>
  );
}
