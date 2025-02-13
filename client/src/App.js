import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/Layout";
import Schedule from "scenes/schedule";
import Details from "scenes/details";
import VideoAnalyse from "scenes/videoAnalyse";
import PlayerDetailsCombined from "scenes/playerDetailsCombined";
import PlayerDetailsGame from "scenes/playerDetailsGame";
import "./index.css";
import Team from "scenes/team";
import HeadToHead from "scenes/headToHead";
import ProfilePage from "scenes/profilePage";
import RegisterPage from "scenes/registerPage";
import LoginPage from "scenes/loginPage";
import HelpPage from "scenes/hilfe";
import { AuthProvider } from "state/AuthContext";
import ShotCard from "scenes/shotcard";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/spielplan" element={<Schedule />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/videoanalyse/:id" element={<VideoAnalyse />} />
                <Route
                  path="/dashboard/playerDetails/:id/"
                  element={<PlayerDetailsCombined />}
                />
                <Route path="/kader" element={<Team />} />
                <Route
                  path="/details/:gameId/:player"
                  element={<PlayerDetailsGame />}
                />
                <Route path="/head-to-head" element={<HeadToHead />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/registrieren" element={<RegisterPage />} />
                <Route path="/einloggen" element={<LoginPage />} />
                <Route path="/hilfe" element={<HelpPage />} />
                <Route
                  path="/details/:gameId/:player/shotcard"
                  element={<ShotCard />}
                />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
