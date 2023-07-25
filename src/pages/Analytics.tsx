import { Typography, Grid } from "@mui/material";
import { Title } from "../components/admin/Title";
import { MainMetric } from "../components/admin/analytics/MainMetric";
import { ViewsByTheme } from "../components/admin/analytics/ViewsByTheme";
import { TotalClicksOnSocialNetwork } from "../components/admin/analytics/TotalClicksOnSocialNetwork";

export function Analytics() {
  return (
    <>
      <Title>Analytics</Title>

      <Typography variant="subtitle1" marginBottom={2}>
        Analyze real-time data and information from your website.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MainMetric title="PAGE VIEWED" metricName="pageViewed" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MainMetric
            title="CLICKS ON FEEDBACK BUTTON"
            metricName="clickOnFeedbackButton"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MainMetric
            title="CLICKS ON SOCIAL NETWORK"
            metricName="clickOnSocialNetworkLink"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ViewsByTheme />
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalClicksOnSocialNetwork />
        </Grid>
      </Grid>
    </>
  );
}
