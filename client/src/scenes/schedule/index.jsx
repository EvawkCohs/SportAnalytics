import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useSelector } from "react-redux";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import useFetchSchedule from "./useFetchSchedule";
import useFetchGameIDs from "./useFetchGameID";
import { useNavigate } from "react-router-dom";
import { useGetTeamModelQuery } from "state/api";

function Schedule() {
  //Teamdaten aus MongoDB auslesen
  const { data: teamData, isLoading } = useGetTeamModelQuery();

  //Id aus GlboalState einlesen
  const teamId = useSelector((state) => state.global.teamId);
  const [urlEnding, setUrlEnding] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  //Spielplan fetchen
  const { schedule, loading, error } = useFetchSchedule(teamId);

  //Zugehörigen gameIDs fetchen
  const gameIDs = useFetchGameIDs(teamId);

  //UrlEnding aus Daten herausfinden
  useEffect(() => {
    if (!isLoading && teamData) {
      const selectedTeam = teamData.find((team) => team.id === teamId);
      if (selectedTeam) {
        setUrlEnding(selectedTeam.urlEnding || "");
      }
    }
  }, [isLoading, teamData, teamId]);

  //Daten mit GameIDs versehen
  const dataWithIDs = schedule.map((item, index) => ({
    ...item,
    gameID: gameIDs[index] || "N/A",
  }));

  if (loading) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  if (error) {
    return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  }

  const cols = [
    {
      field: "Gegner",
      headerName: "Gegner",
      flex: 1,
    },
    {
      field: "Heimspiel",
      headerName: "Heimspiel?",
      flex: 1,
      renderCell: (params) => {
        const value = params.value;
        // Konvertiere den Wert, falls er als String importiert wird
        if (value === true || value === "true") {
          return "ja";
        } else if (value === false || value === "false") {
          return "nein";
        }
        return value;
      },
    },
    {
      field: "Datum",
      headerName: "Datum",
      flex: 1,
    },
    {
      field: "Uhrzeit",
      headerName: "Uhrzeit",
      flex: 1,
    },
    {
      field: "Adresse",
      headerName: "Ort",
      flex: 1,
    },
    {
      field: "gameID",
      headerName: "GameID",
      flex: 1,
    },
  ];

  const row = dataWithIDs.map((row, index) => ({
    id: index,
    ...row,
    flex: 1,
  }));

  //OnClick zu GameDetails
  const handleCellClick = (param, event) => {
    navigate(`/details/${param.row.gameID}`);
  };

  //Log für die Entwicklung
  //console.log(schedule);

  return (
    <Box m="1.5rem  2.5rem">
      <Header title="SCHEDULE" subtitle="Schedule der Mannschaft" />

      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            backgroundColor: theme.palette.primary[500],
            cursor: "pointer",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[400],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[400]} !important`,
          },
        }}
      >
        <DataGrid
          rows={row || []}
          columns={cols}
          components={{ ColumnMenu: CustomColumnMenu }}
          onCellClick={handleCellClick}
        />
      </Box>
    </Box>
  );
}

export default Schedule;
