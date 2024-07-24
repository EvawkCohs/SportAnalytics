import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import TeamIDs from "scenes/teamids";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/Layout";
import Schedule from "scenes/schedule";
import Details from "scenes/details";
import { DataProvider } from "components/DataContext";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <DataProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/teamIDs" element={<TeamIDs />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/details/:id" element={<Details />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;
