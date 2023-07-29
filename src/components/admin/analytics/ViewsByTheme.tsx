import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useAnalyticsData } from "../../../analytics";
import { COLORS } from "../../../utils/constants";
import { Card } from "../Card";

export function ViewsByTheme() {
  const [chartData, setChartData] = useState([{ name: "", value: 0 }]);
  const data = useAnalyticsData("pageViewed");

  useEffect(() => {
    if (!data) return;

    const totalDark = data.data.filter(
      ({ properties }: any) => properties.theme === "dark"
    ).length;
    const totalLight = data.total - totalDark;

    setChartData([
      { name: "Light", value: totalLight },
      { name: "Dark", value: totalDark },
    ]);
  }, [data]);

  return (
    <Card title="VIEWS BY THEME">
      <PieChart width={520} height={400}>
        <Pie data={chartData} dataKey="value" label labelLine={false}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Legend iconType="circle" iconSize={10} />
      </PieChart>
    </Card>
  );
}
