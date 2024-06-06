import React from "react";
import { Box, useTheme } from "@mui/material";
import { useGetallGamesModelQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";

function Gameids() {
  const theme = useTheme();
  const { data, isLoading } = useGetallGamesModelQuery();

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: `tournament`,
      type: "object",
      valueGetter: (value, row) => {
        return row.tournament.id;
      },
      headerName: "Tournament ID",
      flex: 1,
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="GAMEIDS" subtitle="List of Game IDs" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
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
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
}
export default Gameids;
