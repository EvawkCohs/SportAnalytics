import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween.jsx";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { AccountCircleOutlined } from "@mui/icons-material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  { text: "Spielplan und Teamauswahl", icon: null },
  {
    text: "Spielplan",
    icon: <CalendarMonthOutlined />,
  },
  { text: "Statistiken", icon: null },
  { text: "Kader", icon: <Groups2OutlinedIcon /> },
  { text: "Head-to-Head", icon: <ElectricBoltOutlinedIcon /> },
  { text: "Registrieren und einloggen", icon: null },
  { text: "Registrieren", icon: <AppRegistrationIcon /> },
  { text: "Einloggen", icon: <LoginOutlinedIcon /> },
  { text: "Profil", icon: <AccountCircleOutlined /> },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    SPORTANALYTICS
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box  position="absolute" width="100%" bottom="1rem">
              <Divider/>
              <List>
                <ListItem key="Hilfe" disablePadding><ListItemButton onClick={() => {
                        navigate(`/hilfe`);
                        setActive("hilfe");
                      }}
                      sx={{
                        backgroundColor:
                          active === "hilfe"
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === "hilfe"
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}><ListItemIcon
                      sx={{
                        ml: "2rem",
                        color:
                          active === "hilfe"
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[200],
                      }}
                    >
                      {<HelpOutlineOutlinedIcon/>}
                    </ListItemIcon><ListItemText primary={"Hilfe"} />{active === "hilfe" && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}</ListItemButton></ListItem>
              </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
