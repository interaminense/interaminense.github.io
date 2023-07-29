import { Grid, Typography } from "@mui/material";
import { Card } from "../Card";
import { useAnalyticsData } from "../../../analytics";

interface IMetricProps {
  title: string;
  metricName: string;
}

export function MainMetric({ title, metricName }: IMetricProps) {
  const data = useAnalyticsData(metricName);

  return (
    <Card title={title}>
      <Grid display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h1" className="text-center">
          {data?.total ?? 0}
        </Typography>
      </Grid>
    </Card>
  );
}
