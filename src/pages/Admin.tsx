import { Box, Tabs, Tab, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Links } from "../components/private-components/Links";
import { Profile } from "../components/private-components/Profile";
import { Projects } from "../components/private-components/Projects";
import { Skills } from "../components/private-components/Skills";
import { Tags } from "../components/private-components/Tags";
import { Title } from "../components/Title";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function Admin() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Title>Control Panel</Title>

      <Typography variant="subtitle1" marginBottom={2}>
        Update personal information and manage projects, including adding or
        removing them.
      </Typography>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Skills" {...a11yProps(1)} />
            <Tab label="Links" {...a11yProps(2)} />
            <Tab label="Projects" {...a11yProps(3)} />
            <Tab label="Tags" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Skills />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Links />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Projects />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Tags />
        </TabPanel>
      </Box>
    </>
  );
}
