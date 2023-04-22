import { Box, Tabs, Tab, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { SocialNetwork } from "../components/admin/SocialNetwork";
import { Profile } from "../components/admin/Profile";
import { Projects } from "../components/admin/Projects";
import { Skills } from "../components/admin/Skills";
import { Tags } from "../components/admin/Tags";
import { Title } from "../components/admin/Title";
import { Links } from "../components/admin/Links";
import { Feedbacks } from "../components/admin/Feedbacks";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ITab {
  label: string;
  Component: React.ReactNode;
}

const TABS: ITab[] = [
  {
    label: "Profile",
    Component: <Profile />,
  },
  {
    label: "Skills",
    Component: <Skills />,
  },
  {
    label: "Social",
    Component: <SocialNetwork />,
  },
  {
    label: "Projects",
    Component: <Projects />,
  },
  {
    label: "Tags",
    Component: <Tags />,
  },
  {
    label: "Links",
    Component: <Links />,
  },
  {
    label: "Feedbacks",
    Component: <Feedbacks />,
  },
];

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
            {TABS.map(({ label }, index) => (
              <Tab label={label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        {TABS.map(({ Component }, index) => (
          <TabPanel value={value} index={index}>
            {Component}
          </TabPanel>
        ))}
      </Box>
    </>
  );
}
