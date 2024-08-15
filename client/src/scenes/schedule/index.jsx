import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useSelector } from "react-redux";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import useFetchSchedule from "./useFetchSchedule";
import useFetchGameIDs from "./useFetchGameID";
import { useNavigate } from "react-router-dom";
import { useGetTeamModelQuery } from "state/api";
import { useDispatch } from "react-redux";
import { setId } from "state";
import Select from "@mui/material/Select";

function Schedule() {
  //Teamdaten aus MongoDB auslesen
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const [team, setTeam] = React.useState("");
  //Id aus GlboalState einlesen
  const dispatch = useDispatch();
  const teamId = useSelector((state) => state.global.teamId);
  const [urlEnding, setUrlEnding] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const handleChange = (event) => {
    setTeam(event.target.value);

    const selectedTeam = event.target.value;
    dispatch(setId(selectedTeam));
  };
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
      <Box
        display="grid"
        gridTemplateColumns="2"
        gridTemplateRows="1"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <Header
          title="SCHEDULE"
          subtitle="Schedule der Mannschaft"
          gridColumn="1"
        />
        <Box gridColumn="2">
          <FormControl fullWidth>
            <InputLabel id="Mannschaftsauswahl">Mannschaft</InputLabel>
            <Select value={team} label="team" onChange={handleChange}>
              <MenuItem value={"sportradar.dhbdata.489-1648"}>
                Bergische Panther
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.1893-1648"}>
                HLZ Friesenheim-Hochdorf II
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.885-1648"}>
                VTV Mundenheim 1883
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.420-1648"}>
                HSG Dutenhofen-Münchholzhausen II
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.453-1648"}>
                Longericher SC Köln
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.417-1648"}>
                HSG Rodgau Nieder-Roden
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.513-1648"}>
                TSG Haßloch
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.516-1648"}>
                HG Saarlouis
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.411-1648"}>
                TV Gelnhausen
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.438-1648"}>
                Saase3Leutershausen
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.2715-1648"}>
                TuS 1882 Opladen
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.3506-1648"}>
                TV Aldekerk 07
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.426-1648"}>
                HSG Hanau
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.3899-1648"}>
                TV Korschenbroich
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.2700-1648"}>
                HSG Krefeld Niederrhein
              </MenuItem>
              <MenuItem value={"sportradar.dhbdata.1881-1648"}>
                TV Kirchzell
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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
