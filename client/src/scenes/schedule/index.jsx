import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useSelector } from "react-redux";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import useFetchSchedule from "./useFetchSchedule";
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

  //UrlEnding aus Daten herausfinden
  useEffect(() => {
    if (!isLoading && teamData) {
      const selectedTeam = teamData.find((team) => team.id === teamId);
      if (selectedTeam) {
        setUrlEnding(selectedTeam.urlEnding || "");
      }
      console.log(selectedTeam);
    }
  }, [isLoading, teamData, teamId]);

  // const { schedule, loading, error } = useFetchSchedule(teamId, urlEnding);
  // if (loading) {
  //   return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  // }

  // if (error) {
  //   return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  // }

  // const columns = [
  //   {
  //     field: "Gegner",
  //     headerName: "Gegner",
  //     flex: 1,
  //     renderCell: (params) => params.value.name,
  //   },
  //   {
  //     field: "Heimspiel",
  //     headerName: "Heimspiel",
  //     flex: 1,
  //     renderCell: (params) => params.value.name,
  //   },
  //   {
  //     field: "Datum",
  //     headerName: "Datum",
  //     flex: 1,
  //     renderCell: (params) => params.value.name,
  //   },
  // ];

  // //OnClick zu GameDetails
  // const handleCellClick = (param, event) => {
  //   navigate(`/details/${param.row.id}`); //TODO Id des Spiels muss aus irgendwie rein aus dem Namen gefiltert werden. Idee: Alle Spiele in eine Collection einlesen und dann das enstprechende Spiel filtern mit teamId und dem Gegnernamen
  // };

  //Log für die Entwicklung
  //console.log(schedule);

  return (
    <Box m="1.5rem  2.5rem">
      <Header title="SCHEDULE" subtitle="Schedule der Mannschaft" />
      {/* <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
            color: theme.palette.secondary[700],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[400]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.id}
          rows={schedule || []}
          columns={columns}
          components={{ ColumnMenu: CustomColumnMenu }}
          onCellClick={handleCellClick}
        />
      </Box> */}
    </Box>
  );
}

export default Schedule;
