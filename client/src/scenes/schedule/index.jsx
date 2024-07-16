import React from "react";
import {
  Box,
  FormControl,
  useTheme,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Header from "components/Header";
import { useSelector } from "react-redux";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import useFetchSchedule from "./useFetchSchedule";
import formatTimestamp from "./formatTimestamp";

const Schedule = () => {
  const teamId = useSelector((state) => state.global.teamId);
  const { schedule, loading, error } = useFetchSchedule(teamId);
  const theme = useTheme();

  if (loading) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  if (error) {
    return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  }

  const columns = [
    {
      field: "homeTeam",
      headerName: "Heimmannschaft",
      flex: 1,
      renderCell: (params) => params.value.name,
    },
    {
      field: "awayTeam",
      headerName: "Auswärtsmannschaft",
      flex: 1,
      renderCell: (params) => params.value.name,
    },
    {
      field: "startsAt",
      headerName: "Datum",
      flex: 1,
      renderCell: (params) => formatTimestamp(params.value),
    },
  ];
  console.log(schedule);

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
        />
      </Box>
    </Box>

    // <div>
    //   <h1>Schedule</h1>
    //   <ul>
    //     {schedule.map((game, index) => (
    //       <li key={index}>
    //         Heimteam: {game.homeTeam.name}, Auswärtsteam: {game.awayTeam.name}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default Schedule;
