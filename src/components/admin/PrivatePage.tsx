import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Avatar, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading";
import { useAppContext } from "../../AppContext";
import { DataBase } from "../../firebase/database";
import { TProfile } from "../../types";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Admin.scss";

const profileDB = new DataBase({ path: "profile" });

export function PrivatePage({ children }: { children: JSX.Element }) {
  const { auth } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleSignOut() {
    await auth?.signOut();

    navigate("/", { replace: true });
  }

  useEffect(() => {
    async function onAuthStateChanged() {
      auth?.auth.onAuthStateChanged(() => {
        setLoading(false);
      });
    }

    onAuthStateChanged();
  }, [auth?.auth]);

  useEffect(() => {
    profileDB.listData(
      (groupedData) => {
        setProfile(groupedData.data[0] as TProfile);
      },
      { onlyOnce: true }
    );
  }, []);

  if (loading) {
    return <Loading page />;
  }

  if (!auth?.isKnownUser) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>

            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
              <MenuItem onClick={() => navigate("/analytics")}>
                Analytics
              </MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                Settings
              </MenuItem>
            </Menu>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin
            </Typography>

            <Button color="inherit" onClick={handleSignOut}>
              signout
            </Button>

            {profile?.imageURL && (
              <Avatar
                sx={{ marginLeft: 2 }}
                alt="Profile Avatar"
                src={profile?.imageURL}
              />
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Container fixed>{children}</Container>
    </>
  );
}
