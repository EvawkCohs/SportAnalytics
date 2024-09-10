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
import { useFindExistingGamesQuery, useGetTeamModelQuery } from "state/api";
import { useDispatch } from "react-redux";
import { setId, setTeamGamesData } from "state";
import Select from "@mui/material/Select";
import useProcessAllGames from "./processAllGames";
import { GetDetailedGameData } from "scenes/dashboard/collectGamesAndDetails";
import handleAddGame from "scenes/details/usePostGameData";
function Schedule() {
  //Teamdaten aus MongoDB auslesen
  const { data: teamData, isLoading } = useGetTeamModelQuery();
  const [team, setTeam] = React.useState("");
  const [group, setGroup] = useState("SW");
  //Id aus GlboalState einlesen
  const dispatch = useDispatch();
  const teamId = useSelector((state) => state.global.teamId);
  const [urlEnding, setUrlEnding] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  //Change Handle für Dropdown-Auswahl
  const handleTeamChange = (event) => {
    setTeam(event.target.value);

    const selectedTeam = event.target.value;
    dispatch(setId(selectedTeam));
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const filteredTeams = (teamData || [])
    .filter((team) => team.group === group)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

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
  const allGamesDetails = GetDetailedGameData(dataWithIDs);
  handleAddGame(allGamesDetails);
  console.log(allGamesDetails);
  if (loading || isLoading) {
    return <div>Loading....</div>; // Später noch Ladekreis einbauen oder etwas vergleichbares
  }

  if (error) {
    return <div>Error: {error}</div>; // Fehlermeldung Rendern (später anpassen)
  }

  const cols = [
    {
      field: "team1",
      headerName: "Heimmannschaft",
      flex: 1,
      renderCell: (params) => {
        const { Heimspiel, Gegner } = params.row;
        if (!teamData || !Array.isArray(teamData)) {
          // Fallback-Wert, falls teamData nicht verfügbar ist
          return Heimspiel === "true" ? "Keine Daten verfügbar" : Gegner;
        }
        const Heimmannschaft = teamData.find((team) => team.id === teamId);
        if (Heimspiel === "true") {
          return Heimmannschaft.name;
        } else {
          return Gegner;
        }
      },
    },
    {
      field: "team2",
      headerName: "Gastmannschaft",
      flex: 1,
      renderCell: (params) => {
        const { Heimspiel, Gegner } = params.row;
        if (!teamData || !Array.isArray(teamData)) {
          // Fallback-Wert, falls teamData nicht verfügbar ist
          return Heimspiel === "true" ? "Keine Daten verfügbar" : Gegner;
        }
        const Heimmannschaft = teamData.find((team) => team.id === teamId);
        if (Heimspiel === "false") {
          return Heimmannschaft.name;
        } else {
          return Gegner;
        }
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
        gridTemplateColumns="6"
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
          gridColumn="1/3"
        />
        {/*Staffelauswahl Dropdown*/}
        <Box
          gridColumn="4"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="0 2rem"
          flex="1 1 100%"
          borderRadius="0.55rem"
        >
          <FormControl fullWidth>
            <InputLabel id="Staffelauswahl">Staffel</InputLabel>
            <Select value={group} label="group" onChange={handleGroupChange}>
              <MenuItem value="SW">3. Liga Staffel Süd-West</MenuItem>
              <MenuItem value="S">3. Liga Staffel Süd</MenuItem>
              <MenuItem value="NO">3. Liga Staffel Nord-Ost</MenuItem>
              <MenuItem value="NW">3. Liga Staffel Nord-West</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/*Teamauswahl Dropdown*/}
        <Box gridColumn="5/6">
          <FormControl fullWidth>
            <InputLabel id="Mannschaftsauswahl">Mannschaft</InputLabel>
            <Select value={team} label="team" onChange={handleTeamChange}>
              {isLoading ? (
                <MenuItem disabled>Loading...</MenuItem> // Anzeige während des Ladens
              ) : (
                filteredTeams?.map(
                  (
                    team // Sicherheitsabfrage, ob teamData existiert
                  ) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  )
                )
              )}
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
            backgroundColor: theme.palette.grey[800],
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
