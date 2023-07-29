import {
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Title } from "../components/admin/Title";
import { MainMetric } from "../components/admin/analytics/MainMetric";
import { ViewsByTheme } from "../components/admin/analytics/ViewsByTheme";
import { ViewsBySocialNetworkClicks } from "../components/admin/analytics/ViewsBySocialNetworkClicks";
import { ViewsByPlatform } from "../components/admin/analytics/ViewsByPlatform";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Feedbacks } from "../components/admin/Feedbacks";

function setRangekeyParam(value: number) {
  const url = new URLSearchParams();
  url.set("rangeKey", String(value));

  return url;
}

export function Analytics() {
  const [rangeKey, setRangekey] = useState(30);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const rangeKey = searchParams.get("rangeKey");

      if (rangeKey) {
        setRangekey(Number(rangeKey));
      } else {
        setSearchParams(setRangekeyParam(30));
      }
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <Title>Analytics</Title>

      <Typography variant="subtitle1" marginBottom={2}>
        Analyze real-time data and information from your website.
      </Typography>

      <Alert
        sx={{ mb: 2 }}
        severity="info"
        action={
          <FormControl variant="standard" sx={{ minWidth: 180 }}>
            <Select
              labelId="timeFilter"
              value={rangeKey}
              label="time filter"
              onChange={({ target: { value } }) => {
                setRangekey(Number(value));
                setSearchParams(setRangekeyParam(Number(value)));
              }}
            >
              <MenuItem value={1}>Today</MenuItem>
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        }
      >
        Filter data by time range, currently data is showing for the last{" "}
        {searchParams.get("rangeKey")} days
      </Alert>

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
          <ViewsBySocialNetworkClicks />
        </Grid>
        <Grid item xs={12} md={6}>
          <ViewsByPlatform name="browser" title="TOP 5 MOST USED BROWSERS" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ViewsByPlatform name="os" title="TOP 5 MOST USED OPERATING SYSTEM" />
        </Grid>
        <Grid item xs={12}>
          <Feedbacks showDeleteButton={false} />
        </Grid>
      </Grid>
    </>
  );
}
